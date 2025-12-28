import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_live_2jkPlqhiMAtLNB1Z3u2lKBDN000j4pWXPQ";
if (!STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount }: { amount: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your donation!",
      });
      window.location.href = '/donate/success';
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 text-lg"
        size="lg"
      >
        {isProcessing ? "Processing..." : `Donate $${amount}`}
      </Button>
    </form>
  );
};

export default function StripeCheckoutPage() {
  const [location] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secretFromUrl = params.get('client_secret');
    const amountFromUrl = params.get('amount');
    
    if (secretFromUrl && amountFromUrl) {
      setClientSecret(secretFromUrl);
      setAmount(amountFromUrl);
    }
  }, [location]);

  if (!clientSecret) {
    return (
      <>
        <Helmet>
          <title>Checkout | Prayer Watchman</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Prayer Watchman</title>
        <meta name="description" content="Complete your donation to support the Prayer Watchman movement worldwide." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Donation
              </h1>
              <p className="text-gray-600">
                You're donating ${amount} to support the Prayer Watchman movement
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                  },
                }}
              >
                <CheckoutForm amount={amount} />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}