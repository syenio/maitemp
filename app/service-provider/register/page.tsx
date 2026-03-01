'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, Mail, Phone, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileUpload } from '@/components/FileUpload';
import { colors } from '@/lib/colors';

interface VerificationStatus {
  email: { isVerified: boolean };
  phone: { isVerified: boolean };
  panCard: { isVerified: boolean };
}

export default function ServiceProviderRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    experience: 0,
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: '',
    },
    documents: {
      profileImage: '',
      panCardImage: '',
      aadharImage: '',
    },
    panCardNumber: '',
    aadharNumber: '',
  });

  const [verification, setVerification] = useState<VerificationStatus>({
    email: { isVerified: false },
    phone: { isVerified: false },
    panCard: { isVerified: false },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'email' | 'phone' | 'pan' | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const router = useRouter();

  // Verification functions using actual API routes
  const sendEmailVerification = async () => {
    if (!formData.email) {
      alert('Please enter your email address first');
      return;
    }
    
    try {
      const response = await fetch('/api/verification/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVerificationStep('email');
        alert(`Verification email sent! ${data.otp ? `Use OTP: ${data.otp}` : 'Check your email for OTP'}`);
      } else {
        alert(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      alert('Failed to send verification email');
    }
  };

  const sendPhoneVerification = async () => {
    if (!formData.phone) {
      alert('Please enter your phone number first');
      return;
    }
    
    try {
      const response = await fetch('/api/verification/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVerificationStep('phone');
        alert(`OTP sent to your phone! ${data.otp ? `Use OTP: ${data.otp}` : 'Check your SMS for OTP'}`);
      } else {
        alert(data.error || 'Failed to send phone OTP');
      }
    } catch (error) {
      console.error('Phone verification error:', error);
      alert('Failed to send phone OTP');
    }
  };

  const sendPanVerification = async () => {
    if (!formData.panCardNumber || !formData.documents.panCardImage) {
      alert('Please enter PAN number and upload PAN card image first');
      return;
    }
    
    try {
      const response = await fetch('/api/verification/verify-pan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          panNumber: formData.panCardNumber,
          documentUrl: formData.documents.panCardImage 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVerificationStep('pan');
        alert(`PAN verification initiated! ${data.otp ? `Use OTP: ${data.otp}` : 'Check your registered contact for OTP'}`);
      } else {
        alert(data.error || 'Failed to initiate PAN verification');
      }
    } catch (error) {
      console.error('PAN verification error:', error);
      alert('Failed to initiate PAN verification');
    }
  };

  const verifyOTP = async () => {
    if (!otpInput || !verificationStep) {
      alert('Please enter the OTP');
      return;
    }
    
    try {
      const response = await fetch('/api/verification/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: verificationStep,
          otp: otpInput,
          email: verificationStep === 'email' ? formData.email : undefined,
          phone: verificationStep === 'phone' ? formData.phone : undefined,
          panNumber: verificationStep === 'pan' ? formData.panCardNumber : undefined,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVerification(prev => ({
          ...prev,
          [verificationStep]: { isVerified: true },
        }));
        setVerificationStep(null);
        setOtpInput('');
        alert(`${verificationStep.toUpperCase()} verified successfully!`);
      } else {
        alert(data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('Failed to verify OTP');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!verification.email.isVerified || !verification.phone.isVerified || !verification.panCard.isVerified) {
      alert('Please complete all verifications before submitting');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/service-providers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          verification,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setGeneratedQR(data.qrCode);
        alert('Registration successful! Your QR code has been generated.');
      } else {
        alert(data.error || 'Registration failed');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
      setSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Show QR Code after successful registration
  if (generatedQR) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Check className="w-6 h-6 text-green-600" />
              <span>Registration Successful!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={generatedQR} alt="Provider QR Code" className="w-32 h-32" />
            </div>
            <p className="text-sm text-gray-600">
              This is your unique provider QR code. Save it for future reference.
            </p>
            <Button onClick={() => router.push('/service-provider')} className="w-full">
              Go to Provider Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Become a Verified Service Provider</h1>
          </div>
          <p className="mt-2 text-gray-600">Complete verification process to join our trusted network</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-24 h-1 mx-2 ${
                    step < currentStep ? 'bg-gray-900' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Personal Info</span>
            <span>Verification</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* OTP Verification Modal */}
        {verificationStep && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <CardHeader>
                <CardTitle>Enter OTP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter the OTP sent to your {verificationStep === 'email' ? 'email' : verificationStep === 'phone' ? 'phone' : 'registered contact'}
                </p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  maxLength={6}
                />
                <div className="flex space-x-2">
                  <Button onClick={verifyOTP} className="flex-1">
                    Verify
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setVerificationStep(null);
                      setOtpInput('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: colors.background.primary,
                        color: colors.text.primary,
                        borderColor: colors.border.medium,
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <Input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image *
                  </label>
                  <FileUpload
                    onUpload={(url) => setFormData(prev => ({ 
                      ...prev, 
                      documents: { ...prev.documents, profileImage: url }
                    }))}
                    folder="service-providers/profiles"
                  />
                  {formData.documents.profileImage && (
                    <img 
                      src={formData.documents.profileImage} 
                      alt="Profile" 
                      className="mt-2 w-20 h-20 rounded-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                  <div className="space-y-4">
                    <Input
                      name="address.street"
                      placeholder="Street Address *"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        name="address.city"
                        placeholder="City *"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        name="address.state"
                        placeholder="State *"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        name="address.zipCode"
                        placeholder="ZIP Code *"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      name="emergencyContact.name"
                      placeholder="Contact Name *"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="emergencyContact.phone"
                      placeholder="Contact Phone *"
                      value={formData.emergencyContact.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="emergencyContact.relation"
                      placeholder="Relation *"
                      value={formData.emergencyContact.relation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Verification */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <p className="text-sm text-gray-600">Verify your email, phone, and PAN card</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Verification */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span className="font-medium">Email Verification</span>
                    </div>
                    {verification.email.isVerified ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={verification.email.isVerified}
                    />
                    {!verification.email.isVerified && (
                      <Button 
                        type="button" 
                        onClick={sendEmailVerification}
                        disabled={!formData.email}
                        size="sm"
                      >
                        Send Verification Email
                      </Button>
                    )}
                  </div>
                </div>

                {/* Phone Verification */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span className="font-medium">Phone Verification</span>
                    </div>
                    {verification.phone.isVerified ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={verification.phone.isVerified}
                    />
                    {!verification.phone.isVerified && (
                      <Button 
                        type="button" 
                        onClick={sendPhoneVerification}
                        disabled={!formData.phone}
                        size="sm"
                      >
                        Send OTP
                      </Button>
                    )}
                  </div>
                </div>

                {/* PAN Card Verification */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span className="font-medium">PAN Card Verification</span>
                    </div>
                    {verification.panCard.isVerified ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <Input
                      name="panCardNumber"
                      placeholder="PAN Card Number *"
                      value={formData.panCardNumber}
                      onChange={handleInputChange}
                      required
                      disabled={verification.panCard.isVerified}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PAN Card Image *
                      </label>
                      <FileUpload
                        onUpload={(url) => setFormData(prev => ({ 
                          ...prev, 
                          documents: { ...prev.documents, panCardImage: url }
                        }))}
                        folder="service-providers/documents"
                        disabled={verification.panCard.isVerified}
                      />
                    </div>
                    {!verification.panCard.isVerified && (
                      <Button 
                        type="button" 
                        onClick={sendPanVerification}
                        disabled={!formData.panCardNumber || !formData.documents.panCardImage}
                        size="sm"
                      >
                        Verify PAN Card
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <p className="text-sm text-gray-600">Review your information and submit your application</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Name:</strong> {formData.name}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Phone:</strong> {formData.phone}</p>
                      <p><strong>Experience:</strong> {formData.experience} years</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Verification Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Email:</span>
                        {verification.email.isVerified ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Phone:</span>
                        {verification.phone.isVerified ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">PAN Card:</span>
                        {verification.panCard.isVerified ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={currentStep === 2 && (!verification.email.isVerified || !verification.phone.isVerified || !verification.panCard.isVerified)}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}