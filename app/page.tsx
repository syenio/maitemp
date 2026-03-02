'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { colors } from '@/lib/colors';
import { HeroCarousel } from '@/components/layout/HeroCarousel';
import { ServiceCards, TrustSection } from '@/components/layout/FeatureCards';
import { TestimonialsSection } from '@/components/layout/TestimonialsSection';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

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

  return (
    <div className="bg-black">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Service Cards */}
      <ServiceCards />

      {/* Trust Section */}
      <TrustSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>Our Services</h3>
            <p style={{ color: colors.text.secondary }}>Choose from our wide range of professional home services</p>
          </div>
          
          {loading ? (
            <div className="text-center">Loading services...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service) => (
                <div key={service._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-xl font-semibold mb-2">{service.name}</h4>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{service.duration}h</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>₹{service.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <a
              href="/services"
              className="px-6 py-3 rounded-lg transition-colors"
              style={{ 
                backgroundColor: colors.primary[950],
                color: colors.text.inverse,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary[800]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary[950]}
            >
              View All Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}