import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DonateSuccessPage() {
  const [isDemo, setIsDemo] = useState(false);
  const [amount, setAmount] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState('');
  const [paymentCaptured, setPaymentCaptured] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get('demo');
    const amountParam = urlParams.get('amount');
    const paypalToken = urlParams.get('token');
    const payerId = urlParams.get('PayerID');
    
    setIsDemo(demoParam === 'true');
    setAmount(amountParam || '');
    
    // If we have PayPal token and payer ID, capture the payment
    if (paypalToken && payerId && !isDemo) {
      capturePayPalPayment(paypalToken);
    }
  }, []);

  const capturePayPalPayment = async (orderId: string) => {
    setIsCapturing(true);
    setCaptureError('');
    
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(`/api/paypal/order/${orderId}/capture`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to capture payment');
      }
      
      const captureData = await response.json();
      console.log('Payment captured successfully:', captureData);
      setPaymentCaptured(true);
      
      // Extract amount from capture data if available
      if (captureData.purchase_units && captureData.purchase_units[0]?.payments?.captures?.[0]?.amount?.value) {
        setAmount(captureData.purchase_units[0].payments.captures[0].amount.value);
      }
      
    } catch (error: any) {
      console.error('Failed to capture PayPal payment:', error);
      setCaptureError(error.message || 'Failed to capture payment');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donation Successful | Prayer Watchman</title>
        <meta name="description" content="Thank you for your donation to the Prayer Watchman movement. Your support helps unite intercessors worldwide." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            {isDemo && (
              <Alert className="mb-6 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  This was a demo payment. No actual transaction was processed.
                </AlertDescription>
              </Alert>
            )}

            {captureError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Payment capture failed: {captureError}
                </AlertDescription>
              </Alert>
            )}

            {isCapturing && (
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Processing your payment...
                </AlertDescription>
              </Alert>
            )}
            
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isDemo ? 'Demo Payment Complete!' : isCapturing ? 'Processing Payment...' : captureError ? 'Payment Issue' : 'Thank You!'}
            </h1>
            
            {amount && (
              <p className="text-2xl font-semibold text-green-600 mb-4">
                ${amount}
              </p>
            )}
            
            <p className="text-lg text-gray-600 mb-6">
              {isDemo 
                ? 'This was a demonstration of the PayPal payment process. To make real donations, proper PayPal credentials need to be configured.'
                : isCapturing
                  ? 'We are finalizing your payment with PayPal. Please wait...'
                  : captureError
                    ? 'There was an issue processing your payment. Please contact support if this problem persists.'
                    : paymentCaptured || amount
                      ? 'Your donation has been successfully processed and captured. Thank you for supporting the Prayer Watchman movement and helping us unite intercessors worldwide.'
                      : 'Your donation has been successfully processed. Thank you for supporting the Prayer Watchman movement and helping us unite intercessors worldwide.'
              }
            </p>
            
            <div className="space-y-4">
              <Link href="/">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold">
                  Return to Home
                </Button>
              </Link>
              
              <Link href="/donate">
                <Button variant="outline" className="w-full">
                  {isDemo ? 'Try Donation Page' : 'Make Another Donation'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}