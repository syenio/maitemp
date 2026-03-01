'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Clock, ArrowLeft, Search, MapPin, ShoppingCart, Plus } from 'lucide-react';
import { colors } from '@/lib/colors';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'childcare', label: 'Child Care' },
    { value: 'eldercare', label: 'Elder Care' },
    { value: 'general', label: 'General' },
  ];

  useEffect(() => {
    // Get search and location from URL parameters
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    setSearchQuery(search);
    setSelectedLocation(location);
    fetchServices();
  }, [searchParams]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    // Filter by category
    const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
    
    // Filter by search query
    const searchMatch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const handleBookService = (serviceId: string) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    router.push(`/booking/${serviceId}`);
  };

  const addToCart = async (serviceId: string) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(serviceId);
    
    try {
      // For demo, use default scheduling - in production, show quick scheduling modal
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'demo-user-id', // In production, get from auth
        },
        body: JSON.stringify({
          serviceId,
          scheduledDate: tomorrow.toISOString().split('T')[0],
          scheduledTime: '10:00',
          address: {
            street: 'Default Address',
            city: selectedLocation || 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
          },
          quantity: 1,
        }),
      });

      if (response.ok) {
        alert('Service added to cart!');
        // Refresh cart icon count
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
          </div>
          
          {/* Search and Location Display */}
          {(searchQuery || selectedLocation) && (
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              {searchQuery && (
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" style={{ color: colors.text.secondary }} />
                  <span className="text-sm" style={{ color: colors.text.secondary }}>
                    Searching for:
                  </span>
                  <span className="font-medium" style={{ color: colors.text.primary }}>
                    "{searchQuery}"
                  </span>
                </div>
              )}
              {selectedLocation && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" style={{ color: colors.text.secondary }} />
                  <span className="text-sm" style={{ color: colors.text.secondary }}>
                    Location:
                  </span>
                  <span className="font-medium" style={{ color: colors.text.primary }}>
                    {selectedLocation}
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('');
                  router.push('/services');
                }}
                className="text-sm px-3 py-1 rounded-full transition-colors"
                style={{ 
                  color: colors.text.secondary,
                  backgroundColor: colors.background.secondary,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background.primary}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.background.secondary}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: selectedCategory === category.value ? colors.primary[950] : colors.background.primary,
                  color: selectedCategory === category.value ? colors.text.inverse : colors.text.secondary,
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.value) {
                    e.currentTarget.style.backgroundColor = colors.background.secondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.value) {
                    e.currentTarget.style.backgroundColor = colors.background.primary;
                  }
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {service.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{service.duration} hours</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₹{service.price}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(service._id)}
                      disabled={addingToCart === service._id}
                      className="flex-1 py-2 px-4 rounded-md transition-colors font-medium border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                      style={{ 
                        color: colors.text.primary,
                        backgroundColor: colors.background.primary,
                      }}
                    >
                      {addingToCart === service._id ? (
                        'Adding...'
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleBookService(service._id)}
                      className="flex-1 py-2 px-4 rounded-md transition-colors font-medium"
                      style={{ 
                        backgroundColor: colors.primary[950],
                        color: colors.text.inverse,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary[800]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary[950]}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <p className="text-gray-600 mb-2">No services found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500">Try searching with different keywords or browse all services</p>
              </div>
            ) : (
              <p className="text-gray-600">No services found in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}