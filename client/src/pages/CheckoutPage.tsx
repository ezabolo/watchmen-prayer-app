import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, ShoppingCart, Wallet, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface CartItem {
  id: number;
  user_id: number;
  book_id: number;
  quantity: number;
  added_at: string;
  book: {
    id: number;
    title: string;
    author: string;
    price: number;
    front_cover_url: string | null;
    stock_quantity: number;
  };
}

// Stripe Payment Component (will be fully implemented when keys are provided)
function StripePayment({ total }: { total: number }) {
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
        <p className="text-yellow-800 text-sm">
          🚧 Stripe payment integration will be activated once API keys are configured.
        </p>
      </div>
      <Button disabled className="w-full">
        <CreditCard className="h-4 w-4 mr-2" />
        Pay ${total.toFixed(2)} with Stripe
      </Button>
    </div>
  );
}

// PayPal Payment Component (will be fully implemented when keys are provided)
function PayPalPayment({ total }: { total: number }) {
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
        <p className="text-yellow-800 text-sm">
          🚧 PayPal payment integration will be activated once API keys are configured.
        </p>
      </div>
      <Button disabled className="w-full bg-blue-600 hover:bg-blue-700">
        <Wallet className="h-4 w-4 mr-2" />
        Pay ${total.toFixed(2)} with PayPal
      </Button>
    </div>
  );
}

export default function CheckoutPage() {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<'stripe' | 'paypal'>('stripe');

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some books to your cart before checkout</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/books">Browse Books</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button asChild variant="ghost" className="mr-4">
            <Link to="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Review your items before payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Items List */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      {/* Book Cover */}
                      <div className="flex-shrink-0">
                        {item.book.front_cover_url ? (
                          <img
                            src={item.book.front_cover_url}
                            alt={item.book.title}
                            className="h-16 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Book Details */}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.book.title}</h4>
                        <p className="text-xs text-gray-600">by {item.book.author}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-semibold">${(item.book.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping === 0 && (
                    <div className="text-xs text-green-600">
                      🎉 Free shipping on orders over $50!
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Options */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPayment} onValueChange={(value) => setSelectedPayment(value as 'stripe' | 'paypal')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="stripe" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Stripe
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      PayPal
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stripe">
                    <StripePayment total={total} />
                  </TabsContent>
                  
                  <TabsContent value="paypal">
                    <PayPalPayment total={total} />
                  </TabsContent>
                </Tabs>

                {/* Security Notice */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    🔒 Your payment information is secure and encrypted. 
                    We do not store your payment details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}