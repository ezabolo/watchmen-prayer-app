import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PayPalButtonProps {
  amount: string;
  currency: string;
  intent: string;
}

export default function PayPalButton({
  amount,
  currency,
  intent,
}: PayPalButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create PayPal order
      const response = await fetch("/api/paypal/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          intent: intent,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create PayPal order");
      }
      
      const orderData = await response.json();
      
      // Handle demo mode differently
      if (orderData.demo) {
        toast({
          title: "Demo Mode Active",
          description: "PayPal credentials not configured. Simulating payment process...",
          variant: "default",
        });
        
        // Simulate PayPal checkout experience in demo mode
        setTimeout(() => {
          const userConfirmed = confirm(
            `Demo PayPal Checkout\n\nAmount: $${amount}\nCurrency: ${currency}\n\nThis is a demonstration. Click OK to simulate successful payment, or Cancel to simulate payment cancellation.`
          );
          
          if (userConfirmed) {
            // Simulate successful payment
            window.location.href = `/donate/success?demo=true&amount=${amount}`;
          } else {
            // Simulate cancelled payment
            toast({
              title: "Payment Cancelled",
              description: "PayPal payment was cancelled in demo mode.",
              variant: "destructive",
            });
          }
        }, 1000);
        return;
      }
      
      // Real PayPal checkout flow
      if (orderData.links) {
        const approvalUrl = orderData.links.find((link: any) => link.rel === 'approve');
        if (approvalUrl) {
          // Open PayPal in new tab to avoid iframe security restrictions
          const newWindow = window.open(approvalUrl.href, '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
          
          if (!newWindow) {
            toast({
              title: "Popup Blocked",
              description: "Please allow popups for this site and try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Redirecting to PayPal",
              description: "Complete your payment in the new tab.",
              variant: "default",
            });
          }
        } else {
          throw new Error("PayPal approval URL not found");
        }
      } else {
        throw new Error("Invalid PayPal order response");
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      toast({
        title: "Payment Error",
        description: "There was an issue processing your PayPal payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handlePayPalPayment}
        disabled={isProcessing}
        className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3 text-lg border-none"
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            Processing...
          </>
        ) : (
          <>
            <span className="mr-2">💳</span>
            Pay ${amount} with PayPal
          </>
        )}
      </Button>
    </div>
  );
}