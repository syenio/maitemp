'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface CartItem {
  _id: string;
  service: {
    _id: string;
    name: string;
    price: number;
    category: string;
    description: string;
  };
  quantity: number;
  scheduledDate: string;
  scheduledTime: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  specialInstructions?: string;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [showPayment, setShowPayment] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'user-id': 'demo-user-id',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        
        if (!data.cart || data.cart.items.length === 0) {
          router.push('/services');
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/cart/payment-initiate', {
        method: 'POST',
        headers: {
          'user-id': 'demo-user-id',
        },
      });
      
      if (response.ok) {
        setShowPayment(true);
        // Simulate user reaching payment page but not completing
        setTimeout(() => {
          alert('Payment page loaded. User can now abandon the payment or complete it.');
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to initiate payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  const simulateAbandon = () => {
    alert('Payment abandoned! This will show as pending payment in admin panel.');
    router.push('/services');
  };

  const simulatePaymentSuccess = async () => {
    // In production, this would be handled by payment gateway callback
    alert('Payment completed successfully! (This is a simulation)');
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart is Empty</h2>
          <Button onClick={() => router.push('/services')}>
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.service.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{item.service.category}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.service.price}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(item.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {item.scheduledTime}
                      </div>
                      {item.address && (
                        <div className="flex items-center md:col-span-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          {item.address.street}, {item.address.city}, {item.address.state} - {item.address.zipCode}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <div className="md:col-span-2">
                          <p className="font-medium">Special Instructions:</p>
                          <p>{item.specialInstructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{cart.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{cart.totalAmount}</span>
                  </div>
                </div>

                {!showPayment ? (
                  <Button
                    onClick={initiatePayment}
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-800">
                          Payment page loaded. This booking is now tracked as "payment pending" in admin panel.
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="payment"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                          />
                          <CreditCard className="w-4 h-4 mr-2" />
                          Credit/Debit Card
                        </label>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="payment"
                            value="upi"
                            checked={paymentMethod === 'upi'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                          />
                          UPI Payment
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={simulatePaymentSuccess}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Complete Payment (Simulate Success)
                      </Button>
                      <Button
                        onClick={simulateAbandon}
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Abandon Payment (Simulate)
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}