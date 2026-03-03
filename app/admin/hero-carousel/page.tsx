'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Move,
  Image as ImageIcon,
  Palette,
  Settings,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
  startDate?: string;
  endDate?: string;
  targetAudience: string;
  clickCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  hasCards?: boolean;
  cards?: Array<{
    title: string;
    description: string;
    icon: string;
    link: string;
    backgroundColor: string;
    textColor: string;
    iconColor: string;
    order: number;
  }>;
}

export default function HeroCarouselAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedSlide, setDraggedSlide] = useState<HeroSlide | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/hero-carousel');
      if (response.ok) {
        const data = await response.json();
        setSlides(data.slides);
      }
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSlideStatus = async (slideId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/hero-carousel/${slideId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchSlides();
      }
    } catch (error) {
      console.error('Failed to toggle slide status:', error);
    }
  };

  const deleteSlide = async (slideId: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`/api/admin/hero-carousel/${slideId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSlides();
      }
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, slide: HeroSlide) => {
    setDraggedSlide(slide);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetSlide: HeroSlide) => {
    e.preventDefault();
    
    if (!draggedSlide || draggedSlide._id === targetSlide._id) return;

    const newSlides = [...slides];
    const draggedIndex = newSlides.findIndex(s => s._id === draggedSlide._id);
    const targetIndex = newSlides.findIndex(s => s._id === targetSlide._id);

    // Remove dragged slide and insert at target position
    newSlides.splice(draggedIndex, 1);
    newSlides.splice(targetIndex, 0, draggedSlide);

    // Update order values
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      order: index + 1
    }));

    setSlides(updatedSlides);
    setDraggedSlide(null);

    // Update order in database
    try {
      await fetch('/api/admin/hero-carousel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: updatedSlides }),
      });
    } catch (error) {
      console.error('Failed to update slide order:', error);
      fetchSlides(); // Revert on error
    }
  };

  const getThemeColor = (theme: string) => {
    const themes = {
      primary: 'bg-black text-white',
      secondary: 'bg-gray-600 text-white',
      accent: 'bg-blue-600 text-white',
      dark: 'bg-gray-900 text-white',
      light: 'bg-gray-100 text-gray-900',
      gradient: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
    };
    return themes[theme as keyof typeof themes] || themes.primary;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No limit';
    return new Date(dateString).toLocaleDateString();
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hero Carousel Management</h1>
                <p className="text-gray-600">Create and manage dynamic hero carousel slides</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/admin/hero-carousel/new')}
              className="bg-black hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Slide
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Slides</p>
                  <p className="text-2xl font-bold text-gray-900">{slides.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Slides</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {slides.filter(s => s.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {slides.reduce((sum, slide) => sum + slide.viewCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {slides.reduce((sum, slide) => sum + slide.clickCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Slides List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Carousel Slides
              <Badge variant="secondary" className="ml-2">
                Drag to reorder
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {slides.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No slides created yet</h3>
                <p className="text-gray-500 mb-4">Create your first hero carousel slide to get started.</p>
                <Button
                  onClick={() => router.push('/admin/hero-carousel/new')}
                  className="bg-black hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Slide
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide) => (
                  <div
                    key={slide._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, slide)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, slide)}
                    className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-move"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Slide Preview */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                          <div 
                            className="absolute inset-0"
                            style={{ 
                              backgroundColor: slide.backgroundColor,
                              opacity: slide.overlayOpacity 
                            }}
                          />
                        </div>
                      </div>

                      {/* Slide Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Move className="w-4 h-4 text-gray-400" />
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {slide.title}
                              </h3>
                              <Badge className={getThemeColor(slide.theme)}>
                                {slide.theme}
                              </Badge>
                              <Badge variant={slide.isActive ? 'default' : 'secondary'}>
                                {slide.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              {slide.hasCards && slide.cards && slide.cards.length > 0 && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  {slide.cards.length} Cards
                                </Badge>
                              )}
                            </div>
                            
                            {slide.subtitle && (
                              <p className="text-sm text-gray-600 mb-2">{slide.subtitle}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(slide.startDate)} - {formatDate(slide.endDate)}
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {slide.viewCount} views
                              </div>
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {slide.clickCount} clicks
                              </div>
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {slide.targetAudience}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSlideStatus(slide._id, slide.isActive)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title={slide.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {slide.isActive ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => router.push(`/admin/hero-carousel/${slide._id}/edit`)}
                              className="p-2 text-gray-400 hover:text-blue-600"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => deleteSlide(slide._id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}