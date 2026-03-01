'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CartItem {
  _id: string;
  service: {
    _id: string;
    name: string;
    price: number;
    category: string;
  };
  quantity: number;
  scheduledDate: string;
  scheduledTime: string;
  address?: {
    street: string;
    city: string;
    state: string;
  };
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
}

export function CartIcon() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'user-id': 'demo-user-id', // In production, get from auth
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
        headers: {
          'user-id': 'demo-user-id',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoading(false);
    }
  };

  const proceedToCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: {
          'user-id': 'demo-user-id',
        },
      });
      
      if (response.ok) {
        // Redirect to checkout page
        window.location.href = '/checkout';
      }
    } catch (error) {
      console.error('Failed to initiate checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items?.length || 0;

  return (
    <div className="relative">
      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </Badge>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!cart || cart.items.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Your cart is empty</p>
                <p className="text-sm">Add services to get started</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.service.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">{item.service.category}</p>
                        <p className="text-sm font-semibold text-gray-900">₹{item.service.price}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.scheduledTime}
                      </div>
                      {item.address && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.address.city}, {item.address.state}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart && cart.items.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold">₹{cart.totalAmount}</span>
              </div>
              <Button
                onClick={proceedToCheckout}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}