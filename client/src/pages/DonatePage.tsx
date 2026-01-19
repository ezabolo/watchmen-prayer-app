import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import PayPalButton from "@/components/PayPalButton";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { LogIn, UserPlus } from "lucide-react";

export default function DonatePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [amount, setAmount] = useState("25");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const predefinedAmounts = ["10", "25", "50", "100", "250"];

  const handleAmountSelect = (value: string) => {
    setAmount(value);
    if (value !== "custom") {
      setCustomAmount("");
    }
  };

  const getFinalAmount = () => {
    return amount === "custom" ? customAmount : amount;
  };

  const handleDonation = async () => {
    const finalAmount = getFinalAmount();
    
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "stripe") {
        // Handle Stripe payment
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseFloat(finalAmount),
          }),
        });

        if (response.ok) {
          const { clientSecret } = await response.json();
          // Add cache busting parameter to ensure fresh load
          const timestamp = Date.now();
          // Redirect to Stripe checkout
          window.location.href = `/stripe-checkout?client_secret=${clientSecret}&amount=${finalAmount}&t=${timestamp}`;
        } else {
          throw new Error("Failed to create payment intent");
        }
      } else if (paymentMethod === "paypal") {
        // Handle PayPal payment
        const response = await fetch("/api/paypal/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: finalAmount,
            currency: "USD",
            intent: "CAPTURE",
          }),
        });

        if (response.ok) {
          const orderData = await response.json();
          // Redirect to PayPal or handle payment
          console.log("PayPal order created:", orderData);
          toast({
            title: "PayPal Payment",
            description: "Redirecting to PayPal...",
          });
        } else {
          throw new Error("Failed to create PayPal order");
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      
      // Check if it's an authentication error
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Sign In Required",
          description: "Please sign in or create an account to complete your donation.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Error",
          description: "There was an issue processing your donation. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donate | Prayer Watchman</title>
        <meta name="description" content="Support the Prayer Watchman movement with your donation. Help us unite intercessors worldwide in prayer for the nations." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
                  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                  color: '#1F2937',
                  lineHeight: '1.1',
                  textShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  marginBottom: '2rem',
                  animation: 'slow-blink 4s ease-in-out infinite'
                }}
              >
                Support the Watchman Movement
              </h1>
              <p className="text-lg text-gray-600">
                Your donation helps us unite intercessors worldwide in prayer for the nations and advance God's kingdom through strategic prayer initiatives.
              </p>
            </div>

            {/* Login Required Message */}
            {!isLoading && !isAuthenticated && (
              <Card className="mb-8 border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                      <LogIn className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Please Sign In to Donate
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      To ensure your donation is secure and you receive a receipt, please sign in or create an account first.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <Link href="/login">
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="outline" className="border-gray-300">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>
                  Choose your donation amount and payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Select Donation Amount
                  </Label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((value) => (
                      <Button
                        key={value}
                        variant={amount === value ? "default" : "outline"}
                        onClick={() => handleAmountSelect(value)}
                        className="h-12"
                      >
                        ${value}
                      </Button>
                    ))}
                    <Button
                      variant={amount === "custom" ? "default" : "outline"}
                      onClick={() => handleAmountSelect("custom")}
                      className="h-12"
                    >
                      Custom
                    </Button>
                  </div>
                  
                  {amount === "custom" && (
                    <div>
                      <Label htmlFor="customAmount">Custom Amount ($)</Label>
                      <Input
                        id="customAmount"
                        type="number"
                        min="1"
                        step="0.01"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Payment Method
                  </Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex-1">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">
                          Secure payment via Stripe
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1">
                        <div className="font-medium">PayPal</div>
                        <div className="text-sm text-gray-500">
                          Pay with your PayPal account
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Donation Impact */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Your Impact
                  </h3>
                  <p className="text-sm text-blue-800">
                    Every donation helps us:
                  </p>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1">
                    <li>• Train new prayer warriors worldwide</li>
                    <li>• Coordinate 24/7 prayer campaigns</li>
                    <li>• Provide resources for intercessors</li>
                    <li>• Reach unreached nations with prayer</li>
                  </ul>
                </div>

                {/* Donate Button */}
                {!isAuthenticated ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">Sign in above to proceed with your donation</p>
                    <Button disabled className="w-full opacity-50 cursor-not-allowed">
                      Sign In Required to Donate
                    </Button>
                  </div>
                ) : paymentMethod === "paypal" && getFinalAmount() ? (
                  <div className="w-full">
                    <div className="text-center mb-4">
                      <p className="text-lg font-semibold text-gray-700">
                        Donate ${getFinalAmount()} with PayPal
                      </p>
                    </div>
                    <PayPalButton 
                      amount={getFinalAmount()}
                      currency="USD"
                      intent="CAPTURE"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={handleDonation}
                    disabled={isProcessing || !getFinalAmount()}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 text-lg"
                    size="lg"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : paymentMethod === "stripe" ? (
                      `Continue to Stripe Checkout - $${getFinalAmount() || "0"}`
                    ) : (
                      `Donate $${getFinalAmount() || "0"}`
                    )}
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Your donation is secure and helps advance God's kingdom through prayer.
                  All transactions are processed securely through our payment partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}