'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Shield, 
  Edit,
  Camera,
  Download,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ServiceProvider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  providerId: string;
  profileImage: string;
  bio: string;
  experience: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isActive: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  verification: {
    email: { isVerified: boolean; verifiedAt?: string };
    phone: { isVerified: boolean; verifiedAt?: string };
    panCard: { isVerified: boolean; verifiedAt?: string };
    aadhar: { isVerified: boolean; verifiedAt?: string };
  };
  qrCode: {
    hash: string;
    imageUrl: string;
    generatedAt: string;
  };
  specializations: string[];
  languages: string[];
  createdAt: string;
}

export default function ServiceProviderProfilePage() {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetchProviderProfile();
  }, []);

  const fetchProviderProfile = async () => {
    try {
      // In production, get provider ID from authentication
      const providerId = localStorage.getItem('providerId') || 'demo-provider';
      
      const response = await fetch(`/api/service-providers/${providerId}`);
      if (response.ok) {
        const data = await response.json();
        setProvider(data.provider);
      } else {
        // Mock data for demo
        setProvider({
          _id: 'demo-id',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91-9876543210',
          providerId: 'MP1234567890ABC',
          profileImage: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=000&color=fff',
          bio: 'Experienced house cleaning professional with 5+ years of experience. Specializes in deep cleaning and eco-friendly products.',
          experience: 5,
          rating: 4.8,
          totalReviews: 127,
          isVerified: true,
          isActive: true,
          address: {
            street: '123 MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001'
          },
          verification: {
            email: { isVerified: true, verifiedAt: '2024-01-15T10:30:00Z' },
            phone: { isVerified: true, verifiedAt: '2024-01-15T10:35:00Z' },
            panCard: { isVerified: true, verifiedAt: '2024-01-15T11:00:00Z' },
            aadhar: { isVerified: true, verifiedAt: '2024-01-15T11:15:00Z' },
          },
          qrCode: {
            hash: 'abc123def456ghi789',
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NUDEyMzQ1Njc4OTA8L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=',
            generatedAt: '2024-01-15T09:00:00Z'
          },
          specializations: ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Sanitization'],
          languages: ['Hindi', 'English', 'Marathi'],
          createdAt: '2024-01-15T09:00:00Z'
        });
      }
    } catch (error) {
      console.error('Error fetching provider profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!provider?.qrCode?.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = provider.qrCode.imageUrl;
    link.download = `${provider.providerId}-qr-code.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h2>
          <Button onClick={() => router.push('/service-provider/register')}>
            Register as Provider
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Service Provider Profile</h1>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={provider.profileImage}
                  alt={provider.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-1 bg-gray-900 text-white rounded-full hover:bg-gray-800">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
                  {provider.isVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge className={provider.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}>
                    {provider.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{provider.rating.toFixed(1)} ({provider.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{provider.experience} years experience</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{provider.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {provider.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Provider ID & QR Code */}
              <div className="text-center">
                <div className="mb-2">
                  <p className="text-sm text-gray-600">Provider ID</p>
                  <p className="font-mono text-sm font-medium">{provider.providerId}</p>
                </div>
                <div className="mb-3">
                  <img
                    src={provider.qrCode.imageUrl}
                    alt="QR Code"
                    className="w-20 h-20 mx-auto border rounded"
                  />
                </div>
                <Button size="sm" onClick={downloadQRCode}>
                  <Download className="w-4 h-4 mr-1" />
                  Download QR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'verification', label: 'Verification Status' },
              { id: 'contact', label: 'Contact & Address' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Experience</label>
                  <p className="text-gray-900">{provider.experience} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rating</label>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{provider.rating.toFixed(1)} ({provider.totalReviews} reviews)</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Languages</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {provider.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Joined</label>
                  <p className="text-gray-900">
                    {new Date(provider.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <img
                    src={provider.qrCode.imageUrl}
                    alt="Provider QR Code"
                    className="w-32 h-32 mx-auto border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Hash</label>
                  <p className="text-xs font-mono text-gray-900 break-all">
                    {provider.qrCode.hash}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Generated</label>
                  <p className="text-gray-900">
                    {new Date(provider.qrCode.generatedAt).toLocaleString()}
                  </p>
                </div>
                <Button onClick={downloadQRCode} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'verification' && (
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <p className="text-sm text-gray-600">Your identity verification details</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Email Verification */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span className="font-medium">Email Verification</span>
                    </div>
                    {provider.verification.email.isVerified ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{provider.email}</p>
                  {provider.verification.email.verifiedAt && (
                    <p className="text-xs text-gray-500">
                      Verified on {new Date(provider.verification.email.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Phone Verification */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span className="font-medium">Phone Verification</span>
                    </div>
                    {provider.verification.phone.isVerified ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{provider.phone}</p>
                  {provider.verification.phone.verifiedAt && (
                    <p className="text-xs text-gray-500">
                      Verified on {new Date(provider.verification.phone.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* PAN Card Verification */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">PAN Card Verification</span>
                    </div>
                    {provider.verification.panCard.isVerified ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">PAN Card Verified</p>
                  {provider.verification.panCard.verifiedAt && (
                    <p className="text-xs text-gray-500">
                      Verified on {new Date(provider.verification.panCard.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Aadhar Verification */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Aadhar Verification</span>
                    </div>
                    {provider.verification.aadhar.isVerified ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {provider.verification.aadhar.isVerified ? 'Aadhar Verified' : 'Aadhar Not Verified'}
                  </p>
                  {provider.verification.aadhar.verifiedAt && (
                    <p className="text-xs text-gray-500">
                      Verified on {new Date(provider.verification.aadhar.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'contact' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact & Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{provider.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{provider.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <div className="mt-1 text-gray-900">
                  <p>{provider.address.street}</p>
                  <p>{provider.address.city}, {provider.address.state} {provider.address.zipCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline">
                Update Availability
              </Button>
              <Button variant="outline">
                Manage Services
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}