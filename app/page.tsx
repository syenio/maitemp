'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, Users } from 'lucide-react';

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MaidEase</h1>
            </div>
            <nav className="flex space-x-4">
              <a href="/auth/signin" className="text-gray-600 hover:text-gray-900">Login</a>
              <a href="/auth/signin" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Sign Up
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Home Services
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Book trusted, verified maids for all your household needs. Quality service at your doorstep.
          </p>
          <a
            href="/services"
            className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Now
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide reliable, professional, and affordable home services with complete peace of mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Verified Professionals</h4>
              <p className="text-gray-600">All our maids are background verified and trained</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Flexible Scheduling</h4>
              <p className="text-gray-600">Book services at your convenient time</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Quality Assured</h4>
              <p className="text-gray-600">100% satisfaction guarantee on all services</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Doorstep Service</h4>
              <p className="text-gray-600">Services delivered right to your home</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h3>
            <p className="text-gray-600">Choose from our wide range of professional home services</p>
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
                    <div className="text-2xl font-bold text-gray-900">₹{service.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <a
              href="/services"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View All Services
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">MaidEase</h5>
              <p className="text-gray-400">Professional home services at your doorstep</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li>House Cleaning</li>
                <li>Cooking</li>
                <li>Laundry</li>
                <li>Child Care</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact</h5>
              <p className="text-gray-400">Email: support@maidservice.com</p>
              <p className="text-gray-400">Phone: +91 9876543210</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MaidEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}