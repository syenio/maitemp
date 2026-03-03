'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Upload, Palette, Type, Link, Calendar, Users, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/FileUpload';

interface SlideData {
  title: string;
  subtitle: string;
  description: string;
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
  startDate: string;
  endDate: string;
  targetAudience: string;
  hasCards: boolean;
  cards: CardData[];
}

interface CardData {
  title: string;
  description: string;
  icon: string;
  link: string;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  order: number;
}

export default function EditHeroSlidePage() {
  const [slideData, setSlideData] = useState<SlideData>({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    theme: 'primary',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    buttonText: 'Book Now',
    buttonLink: '/services',
    buttonColor: '#ffffff',
    buttonBackgroundColor: '#000000',
    overlayOpacity: 0.4,
    textAlignment: 'left',
    contentPosition: 'center-left',
    isActive: true,
    startDate: '',
    endDate: '',
    targetAudience: 'all',
    hasCards: false,
    cards: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slideId = params.id as string;

  const themes = [
    { value: 'primary', label: 'Primary (Black)', color: '#000000' },
    { value: 'secondary', label: 'Secondary (Gray)', color: '#6b7280' },
    { value: 'accent', label: 'Accent (Blue)', color: '#2563eb' },
    { value: 'dark', label: 'Dark', color: '#111827' },
    { value: 'light', label: 'Light', color: '#f9fafb' },
    { value: 'gradient', label: 'Gradient', color: 'linear-gradient(45deg, #8b5cf6, #3b82f6)' },
  ];

  const textAlignments = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];

  const contentPositions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'center-left', label: 'Center Left' },
    { value: 'center', label: 'Center' },
    { value: 'center-right', label: 'Center Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ];

  const targetAudiences = [
    { value: 'all', label: 'All Users' },
    { value: 'new-users', label: 'New Users' },
    { value: 'returning-users', label: 'Returning Users' },
    { value: 'premium-users', label: 'Premium Users' },
  ];

  const availableIcons = [
    'Home', 'ChefHat', 'Baby', 'Shirt', 'Shield', 'Star', 'Clock', 'Users',
    'CheckCircle', 'Heart', 'Zap', 'Award', 'Truck', 'Phone', 'MapPin',
    'Calendar', 'CreditCard', 'Headphones', 'ThumbsUp', 'Gift'
  ];

  const addCard = () => {
    const newCard: CardData = {
      title: '',
      description: '',
      icon: 'Star',
      link: '/services',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      iconColor: '#000000',
      order: slideData.cards.length,
    };
    setSlideData(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

  const removeCard = (index: number) => {
    setSlideData(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  const updateCard = (index: number, field: keyof CardData, value: string | number) => {
    setSlideData(prev => ({
      ...prev,
      cards: prev.cards.map((card, i) => 
        i === index ? { ...card, [field]: value } : card
      )
    }));
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slideData.cards.length) return;

    setSlideData(prev => {
      const newCards = [...prev.cards];
      [newCards[index], newCards[newIndex]] = [newCards[newIndex], newCards[index]];
      return { ...prev, cards: newCards };
    });
  };

  useEffect(() => {
    fetchSlide();
  }, [slideId]);

  const fetchSlide = async () => {
    try {
      const response = await fetch(`/api/admin/hero-carousel/${slideId}`);
      if (response.ok) {
        const data = await response.json();
        const slide = data.slide;
        
        setSlideData({
          title: slide.title || '',
          subtitle: slide.subtitle || '',
          description: slide.description || '',
          imageUrl: slide.imageUrl || '',
          theme: slide.theme || 'primary',
          backgroundColor: slide.backgroundColor || '#000000',
          textColor: slide.textColor || '#ffffff',
          buttonText: slide.buttonText || 'Book Now',
          buttonLink: slide.buttonLink || '/services',
          buttonColor: slide.buttonColor || '#ffffff',
          buttonBackgroundColor: slide.buttonBackgroundColor || '#000000',
          overlayOpacity: slide.overlayOpacity || 0.4,
          textAlignment: slide.textAlignment || 'left',
          contentPosition: slide.contentPosition || 'center-left',
          isActive: slide.isActive !== undefined ? slide.isActive : true,
          startDate: slide.startDate ? slide.startDate.split('T')[0] : '',
          endDate: slide.endDate ? slide.endDate.split('T')[0] : '',
          targetAudience: slide.targetAudience || 'all',
          hasCards: slide.hasCards || false,
          cards: slide.cards || [],
        });
      } else {
        alert('Slide not found');
        router.push('/admin/hero-carousel');
      }
    } catch (error) {
      console.error('Failed to fetch slide:', error);
      alert('Failed to load slide');
      router.push('/admin/hero-carousel');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SlideData, value: string | number | boolean) => {
    setSlideData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!slideData.title || !slideData.imageUrl) {
      alert('Title and image are required');
      return;
    }

    if (slideData.hasCards && slideData.cards.length === 0) {
      alert('Please add at least one card or disable cards feature');
      return;
    }

    if (slideData.hasCards) {
      for (let i = 0; i < slideData.cards.length; i++) {
        const card = slideData.cards[i];
        if (!card.title || !card.description) {
          alert(`Card ${i + 1}: Title and description are required`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/hero-carousel/${slideId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData),
      });

      if (response.ok) {
        router.push('/admin/hero-carousel');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update slide');
      }
    } catch (error) {
      console.error('Failed to update slide:', error);
      alert('Failed to update slide');
    } finally {
      setSaving(false);
    }
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
                onClick={() => router.push('/admin/hero-carousel')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Edit Hero Slide</h1>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-black hover:bg-gray-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Update Slide'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Type className="w-5 h-5 mr-2" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    value={slideData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter slide title"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <Input
                    value={slideData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Enter subtitle (optional)"
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={slideData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter description (optional)"
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Background Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onUpload={(url) => handleInputChange('imageUrl', url)}
                  folder="hero-carousel"
                  accept="image/*"
                />
                {slideData.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={slideData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Design Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Design & Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={slideData.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {themes.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={slideData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-full h-10 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={slideData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="w-full h-10 border rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Opacity: {slideData.overlayOpacity}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={slideData.overlayOpacity}
                    onChange={(e) => handleInputChange('overlayOpacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Alignment
                    </label>
                    <select
                      value={slideData.textAlignment}
                      onChange={(e) => handleInputChange('textAlignment', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {textAlignments.map((alignment) => (
                        <option key={alignment.value} value={alignment.value}>
                          {alignment.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Position
                    </label>
                    <select
                      value={slideData.contentPosition}
                      onChange={(e) => handleInputChange('contentPosition', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {contentPositions.map((position) => (
                        <option key={position.value} value={position.value}>
                          {position.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Button Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="w-5 h-5 mr-2" />
                  Call-to-Action Button
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <Input
                      value={slideData.buttonText}
                      onChange={(e) => handleInputChange('buttonText', e.target.value)}
                      placeholder="Button text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Link
                    </label>
                    <Input
                      value={slideData.buttonLink}
                      onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                      placeholder="/services"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text Color
                    </label>
                    <input
                      type="color"
                      value={slideData.buttonColor}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      className="w-full h-10 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Background
                    </label>
                    <input
                      type="color"
                      value={slideData.buttonBackgroundColor}
                      onChange={(e) => handleInputChange('buttonBackgroundColor', e.target.value)}
                      className="w-full h-10 border rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduling & Targeting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Scheduling & Targeting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={slideData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={slideData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={slideData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={slideData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {targetAudiences.map((audience) => (
                      <option key={audience.value} value={audience.value}>
                        {audience.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Cards Feature */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Feature Cards
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={slideData.hasCards}
                      onChange={(e) => handleInputChange('hasCards', e.target.checked)}
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Cards</span>
                  </label>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slideData.hasCards ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Add feature cards that will be displayed over the carousel slide
                      </p>
                      <Button
                        onClick={addCard}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Card
                      </Button>
                    </div>

                    {slideData.cards.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No cards added yet. Click "Add Card" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {slideData.cards.map((card, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-gray-900">Card {index + 1}</h4>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => moveCard(index, 'up')}
                                  disabled={index === 0}
                                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeCard(index)}
                                  className="p-1 hover:bg-red-100 rounded text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Title *
                                </label>
                                <Input
                                  value={card.title}
                                  onChange={(e) => updateCard(index, 'title', e.target.value)}
                                  placeholder="Card title"
                                  maxLength={100}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Icon
                                </label>
                                <select
                                  value={card.icon}
                                  onChange={(e) => updateCard(index, 'icon', e.target.value)}
                                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                  {availableIcons.map((icon) => (
                                    <option key={icon} value={icon}>
                                      {icon}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                              </label>
                              <Textarea
                                value={card.description}
                                onChange={(e) => updateCard(index, 'description', e.target.value)}
                                placeholder="Card description"
                                rows={2}
                                maxLength={200}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Link
                                </label>
                                <Input
                                  value={card.link}
                                  onChange={(e) => updateCard(index, 'link', e.target.value)}
                                  placeholder="/services"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Background Color
                                </label>
                                <input
                                  type="color"
                                  value={card.backgroundColor}
                                  onChange={(e) => updateCard(index, 'backgroundColor', e.target.value)}
                                  className="w-full h-10 border rounded-md"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Text Color
                                </label>
                                <input
                                  type="color"
                                  value={card.textColor}
                                  onChange={(e) => updateCard(index, 'textColor', e.target.value)}
                                  className="w-full h-10 border rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Icon Color
                                </label>
                                <input
                                  type="color"
                                  value={card.iconColor}
                                  onChange={(e) => updateCard(index, 'iconColor', e.target.value)}
                                  className="w-full h-10 border rounded-md"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Enable cards to add feature cards that will be displayed over the carousel slide.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    {slideData.imageUrl ? (
                      <>
                        <img
                          src={slideData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: slideData.backgroundColor,
                            opacity: slideData.overlayOpacity,
                          }}
                        />
                        <div
                          className={`absolute inset-0 p-6 flex ${getContentPositionStyles(slideData.contentPosition)}`}
                        >
                          <div
                            className={`max-w-md text-${slideData.textAlignment}`}
                            style={{ color: slideData.textColor }}
                          >
                            {slideData.title && (
                              <h2 className="text-2xl font-bold mb-2">{slideData.title}</h2>
                            )}
                            {slideData.subtitle && (
                              <p className="text-lg mb-2 opacity-90">{slideData.subtitle}</p>
                            )}
                            {slideData.description && (
                              <p className="text-sm mb-4 opacity-80">{slideData.description}</p>
                            )}
                            {slideData.buttonText && (
                              <button
                                className="px-6 py-2 rounded-md font-medium transition-colors"
                                style={{
                                  color: slideData.buttonColor,
                                  backgroundColor: slideData.buttonBackgroundColor,
                                }}
                              >
                                {slideData.buttonText}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Cards Preview */}
                        {slideData.hasCards && slideData.cards.length > 0 && (
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {slideData.cards.slice(0, 3).map((card, index) => (
                                <div
                                  key={index}
                                  className="p-3 rounded-lg shadow-lg"
                                  style={{
                                    backgroundColor: card.backgroundColor,
                                    color: card.textColor,
                                  }}
                                >
                                  <div className="flex items-center mb-2">
                                    <div
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2"
                                      style={{ backgroundColor: card.iconColor, color: card.backgroundColor }}
                                    >
                                      {card.icon.charAt(0)}
                                    </div>
                                    <h3 className="text-sm font-semibold truncate">{card.title}</h3>
                                  </div>
                                  <p className="text-xs opacity-90 line-clamp-2">{card.description}</p>
                                </div>
                              ))}
                            </div>
                            {slideData.cards.length > 3 && (
                              <p className="text-center text-xs text-white mt-2 opacity-75">
                                +{slideData.cards.length - 3} more cards
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">Upload an image to see preview</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}