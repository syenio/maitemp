'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Clock, 
  AlertTriangle, 
  CreditCard,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: CartItem[];
  totalAmount: number;
  status: string;
  checkoutInitiatedAt?: string;
  paymentInitiatedAt?: string;
  abandonedAt?: string;
  lastActivity: string;
}

interface Booking {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  service: {
    name: string;
    price: number;
    category: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Stats {
  totalAbandonedCarts: number;
  totalPendingPayments: number;
  totalCheckoutInitiated: number;
  totalPendingBookings: number;
  abandonedRevenue: number;
  pendingRevenue: number;
  checkoutRevenue: number;
}

export default function AbandonedCartsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [abandonedCarts, setAbandonedCarts] = useState<Cart[]>([]);
  const [pendingPaymentCarts, setPendingPaymentCarts] = useState<Cart[]>([]);
  const [checkoutInitiatedCarts, setCheckoutInitiatedCarts] = useState<Cart[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending-payments');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/abandoned-carts');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setAbandonedCarts(data.abandonedCarts);
        setPendingPaymentCarts(data.pendingPaymentCarts);
        setCheckoutInitiatedCarts(data.checkoutInitiatedCarts);
        setPendingBookings(data.pendingBookings);
      }
    } catch (error) {
      console.error('Failed to fetch abandoned carts data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abandoned': return 'bg-red-100 text-red-800';
      case 'payment_pending': return 'bg-yellow-100 text-yellow-800';
      case 'checkout_initiated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Cart Analytics & Abandoned Payments</h1>
            </div>
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Abandoned Carts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAbandonedCarts}</p>
                    <p className="text-sm text-red-600">₹{stats.abandonedRevenue} lost</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPendingPayments}</p>
                    <p className="text-sm text-yellow-600">₹{stats.pendingRevenue} pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Checkout Initiated</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCheckoutInitiated}</p>
                    <p className="text-sm text-blue-600">₹{stats.checkoutRevenue} potential</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPendingBookings}</p>
                    <p className="text-sm text-purple-600">Awaiting action</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'pending-payments', label: 'Pending Payments', count: pendingPaymentCarts.length },
              { id: 'checkout-initiated', label: 'Checkout Initiated', count: checkoutInitiatedCarts.length },
              { id: 'abandoned', label: 'Abandoned Carts', count: abandonedCarts.length },
              { id: 'pending-bookings', label: 'Pending Bookings', count: pendingBookings.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending-payments' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Pending Payments (Users reached payment page but didn't complete)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPaymentCarts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending payments found</p>
              ) : (
                <div className="space-y-4">
                  {pendingPaymentCarts.map((cart) => (
                    <div key={cart._id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{cart.user.name}</span>
                            <Badge className={getStatusColor(cart.status)}>
                              {cart.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {cart.user.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {cart.user.phone}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{cart.totalAmount}</p>
                          <p className="text-xs text-gray-500">
                            Payment initiated: {cart.paymentInitiatedAt && formatDateTime(cart.paymentInitiatedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {cart.items.map((item) => (
                          <div key={item._id} className="flex justify-between items-center text-sm bg-white rounded p-2">
                            <div>
                              <span className="font-medium">{item.service.name}</span>
                              <span className="text-gray-500 ml-2">({item.service.category})</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(item.scheduledDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                {item.scheduledTime}
                              </div>
                              <span className="font-medium">₹{item.service.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'checkout-initiated' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Checkout Initiated (Users started checkout but didn't reach payment)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {checkoutInitiatedCarts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No checkout initiated carts found</p>
              ) : (
                <div className="space-y-4">
                  {checkoutInitiatedCarts.map((cart) => (
                    <div key={cart._id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{cart.user.name}</span>
                            <Badge className={getStatusColor(cart.status)}>
                              {cart.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {cart.user.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{cart.totalAmount}</p>
                          <p className="text-xs text-gray-500">
                            Checkout: {cart.checkoutInitiatedAt && formatDateTime(cart.checkoutInitiatedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {cart.items.map((item) => (
                          <div key={item._id} className="text-sm bg-white rounded p-2">
                            <div className="font-medium">{item.service.name}</div>
                            <div className="text-gray-500">₹{item.service.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'abandoned' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Abandoned Carts (Inactive for 30+ minutes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {abandonedCarts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No abandoned carts found</p>
              ) : (
                <div className="space-y-4">
                  {abandonedCarts.map((cart) => (
                    <div key={cart._id} className="border rounded-lg p-4 bg-red-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{cart.user.name}</span>
                            <Badge className={getStatusColor(cart.status)}>
                              Abandoned
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {cart.user.email}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">₹{cart.totalAmount}</p>
                          <p className="text-xs text-gray-500">
                            Abandoned: {cart.abandonedAt && formatDateTime(cart.abandonedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {cart.items.length} item(s) • Last activity: {formatDateTime(cart.lastActivity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'pending-bookings' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Pending Bookings (Created but payment not completed)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending bookings found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scheduled
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                              <div className="text-sm text-gray-500">{booking.user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.service.name}</div>
                              <div className="text-sm text-gray-500 capitalize">{booking.service.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(booking.scheduledDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">{booking.scheduledTime}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{booking.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              {booking.paymentStatus}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(booking.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}