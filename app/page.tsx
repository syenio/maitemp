'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, Users } from 'lucide-react';
import { colors } from '@/lib/colors';

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
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: `linear-gradient(to right, ${colors.primary[800]}, ${colors.primary[950]})` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Home Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Book trusted, verified maids for all your household needs. Quality service at your doorstep.
          </p>
          <a
            href="/services"
            className="inline-block px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            style={{ 
              backgroundColor: colors.text.inverse,
              color: colors.primary[950],
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.text.inverse}
          >
            Book Now
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>Why Choose Us?</h3>
            <p className="max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              We provide reliable, professional, and affordable home services with complete peace of mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.background.secondary }}>
                <Users className="w-8 h-8" style={{ color: colors.text.primary }} />
              </div>
              <h4 className="text-lg font-semibold mb-2">Verified Professionals</h4>
              <p style={{ color: colors.text.secondary }}>All our maids are background verified and trained</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.background.secondary }}>
                <Calendar className="w-8 h-8" style={{ color: colors.text.primary }} />
              </div>
              <h4 className="text-lg font-semibold mb-2">Flexible Scheduling</h4>
              <p style={{ color: colors.text.secondary }}>Book services at your convenient time</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.background.secondary }}>
                <Star className="w-8 h-8" style={{ color: colors.text.primary }} />
              </div>
              <h4 className="text-lg font-semibold mb-2">Quality Assured</h4>
              <p style={{ color: colors.text.secondary }}>100% satisfaction guarantee on all services</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.background.secondary }}>
                <MapPin className="w-8 h-8" style={{ color: colors.text.primary }} />
              </div>
              <h4 className="text-lg font-semibold mb-2">Doorstep Service</h4>
              <p style={{ color: colors.text.secondary }}>Services delivered right to your home</p>
            </div>
          </div>
        </div>
      </section>

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