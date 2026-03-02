'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Shield, Clock, Users, Play, Pause } from 'lucide-react';
import { colors } from '@/lib/colors';

interface HeroSlide {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  theme: string;
  backgroundColor: string;
  textColor: string;
  buttonText: string;
  buttonLink: string;
  buttonColor: string;
  buttonBackgroundColor: string;
  overlayOpacity: number;
  textAlignment: string;
  contentPosition: string;
  isActive: boolean;
  order: number;
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-carousel');
      if (response.ok) {
        const data = await response.json();
        setSlides(data.slides);
        
        // Track view for first slide
        if (data.slides.length > 0) {
          trackSlideInteraction(data.slides[0]._id, 'view');
        }
      }
    } catch (error) {
      console.error('Failed to fetch carousel slides:', error);
      // Fallback to default slides if API fails
      setSlides(getDefaultSlides());
    } finally {
      setLoading(false);
    }
  };

  const trackSlideInteraction = async (slideId: string, action: 'view' | 'click') => {
    try {
      await fetch('/api/hero-carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slideId, action }),
      });
    } catch (error) {
      console.error('Failed to track slide interaction:', error);
    }
  };

  const getDefaultSlides = (): HeroSlide[] => [
    {
      _id: 'default-1',
      title: 'Professional Home Cleaning',
      subtitle: 'Trusted & Verified Maids',
      description: 'Book experienced, background-verified cleaning professionals for your home. Quality service guaranteed.',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop',
      theme: 'primary',
      backgroundColor: colors.primary[800],
      textColor: colors.text.inverse,
      buttonText: 'Book Cleaning Service',
      buttonLink: '/services',
      buttonColor: colors.primary[950],
      buttonBackgroundColor: colors.text.inverse,
      overlayOpacity: 0.7,
      textAlignment: 'left',
      contentPosition: 'center-left',
      isActive: true,
      order: 1,
    },
    {
      _id: 'default-2',
      title: 'Cooking & Meal Prep',
      subtitle: 'Delicious Home-Cooked Meals',
      description: 'Professional cooks who prepare fresh, healthy meals according to your preferences and dietary needs.',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
      theme: 'accent',
      backgroundColor: colors.primary[900],
      textColor: colors.text.inverse,
      buttonText: 'Find a Cook',
      buttonLink: '/services',
      buttonColor: colors.primary[950],
      buttonBackgroundColor: colors.text.inverse,
      overlayOpacity: 0.6,
      textAlignment: 'left',
      contentPosition: 'center-left',
      isActive: true,
      order: 2,
    },
    {
      _id: 'default-3',
      title: 'Child & Elder Care',
      subtitle: 'Compassionate Care Services',
      description: 'Experienced caregivers for your loved ones. Reliable, caring, and professional support when you need it.',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=600&fit=crop',
      theme: 'secondary',
      backgroundColor: colors.primary[950],
      textColor: colors.text.inverse,
      buttonText: 'Book Care Service',
      buttonLink: '/services',
      buttonColor: colors.primary[950],
      buttonBackgroundColor: colors.text.inverse,
      overlayOpacity: 0.5,
      textAlignment: 'left',
      contentPosition: 'center-left',
      isActive: true,
      order: 3,
    },
    {
      _id: 'default-4',
      title: 'Become a Service Provider',
      subtitle: 'Join Our Network',
      description: 'Start your own business with MaidEase. Connect with customers and grow your service business.',
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop',
      theme: 'gradient',
      backgroundColor: colors.primary[800],
      textColor: colors.text.inverse,
      buttonText: 'Join as Provider',
      buttonLink: '/service-provider/register',
      buttonColor: colors.primary[950],
      buttonBackgroundColor: colors.text.inverse,
      overlayOpacity: 0.6,
      textAlignment: 'left',
      contentPosition: 'center-left',
      isActive: true,
      order: 4,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleButtonClick = (slide: HeroSlide) => {
    trackSlideInteraction(slide._id, 'click');
    window.location.href = slide.buttonLink;
  };

  const getContentPositionStyles = (position: string) => {
    const positions = {
      'top-left': 'items-start justify-start',
      'top-center': 'items-start justify-center',
      'top-right': 'items-start justify-end',
      'center-left': 'items-center justify-start',
      'center': 'items-center justify-center',
      'center-right': 'items-center justify-end',
      'bottom-left': 'items-end justify-start',
      'bottom-center': 'items-end justify-center',
      'bottom-right': 'items-end justify-end',
    };
    return positions[position as keyof typeof positions] || 'items-center justify-start';
  };

  if (loading) {
    return (
      <div className="relative h-[600px] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading carousel...</div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">No carousel slides available</h2>
          <p className="text-gray-500">Please check back later or contact support.</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${slide.imageUrl})`,
              }}
            />
            
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: slide.backgroundColor,
                opacity: slide.overlayOpacity,
              }}
            />
            
            {/* Content */}
            <div className="relative h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                  {/* Text Content */}
                  <div 
                    className={`space-y-6 text-${slide.textAlignment}`}
                    style={{ color: slide.textColor }}
                  >
                    <div className="space-y-2">
                      {slide.subtitle && (
                        <p className="text-lg font-medium opacity-90">{slide.subtitle}</p>
                      )}
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        {slide.title}
                      </h1>
                    </div>
                    
                    {slide.description && (
                      <p className="text-xl opacity-90 max-w-lg">
                        {slide.description}
                      </p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        onClick={() => handleButtonClick(slide)}
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                        style={{ 
                          backgroundColor: slide.buttonBackgroundColor,
                          color: slide.buttonColor,
                        }}
                      >
                        {slide.buttonText}
                      </button>
                      
                      <a
                        href="/services"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-colors"
                        style={{ 
                          borderColor: slide.textColor,
                          color: slide.textColor,
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = slide.textColor;
                          e.currentTarget.style.color = slide.backgroundColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = slide.textColor;
                        }}
                      >
                        View All Services
                      </a>
                    </div>
                  </div>
                  
                  {/* Feature Cards */}
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Shield, title: "Verified", desc: "Background checked" },
                        { icon: Star, title: "Rated 4.9/5", desc: "Customer satisfaction" },
                        { icon: Clock, title: "24/7 Support", desc: "Always available" },
                        { icon: Users, title: "10k+ Customers", desc: "Trusted by many" }
                      ].map((feature, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                          style={{ color: slide.textColor }}
                        >
                          <feature.icon className="w-8 h-8 mb-2" />
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-sm opacity-80">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Play/Pause Button */}
      {slides.length > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        >
          {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
        </button>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: isPlaying ? `${((currentSlide + 1) / slides.length) * 100}%` : '0%'
          }}
        />
      </div>
    </div>
  );
}