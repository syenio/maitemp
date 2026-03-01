import mongoose from 'mongoose';

const ServiceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  experience: {
    type: Number, // years of experience
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Enhanced verification system
  verification: {
    email: {
      isVerified: { type: Boolean, default: false },
      verificationToken: String,
      verifiedAt: Date,
    },
    phone: {
      isVerified: { type: Boolean, default: false },
      otp: String,
      otpExpiry: Date,
      verifiedAt: Date,
    },
    panCard: {
      number: String,
      isVerified: { type: Boolean, default: false },
      documentUrl: String,
      otp: String,
      otpExpiry: Date,
      verifiedAt: Date,
    },
    aadhar: {
      number: String,
      isVerified: { type: Boolean, default: false },
      documentUrl: String,
      verifiedAt: Date,
    },
    bankAccount: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date,
    }
  },
  // Unique provider ID and QR code
  providerId: {
    type: String,
    unique: true,
    required: true,
  },
  qrCode: {
    hash: String, // SHA256 hash
    imageUrl: String, // QR code image URL
    generatedAt: Date,
  },
  availability: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean },
  },
  documents: {
    idProof: String, // URL to uploaded document
    addressProof: String,
    experienceCertificate: String,
    profileImage: String,
    panCardImage: String,
    aadharImage: String,
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String,
  },
  profileImage: String,
  bio: String,
  languages: [String],
  specializations: [String],
  // Additional profile fields
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
  workHistory: [{
    company: String,
    position: String,
    duration: String,
    description: String,
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    certificateUrl: String,
  }],
}, {
  timestamps: true,
});

// Pre-save middleware to generate provider ID and QR code
ServiceProviderSchema.pre('save', async function(next) {
  if (this.isNew && !this.providerId) {
    // Generate unique provider ID
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substring(2, 15);
    this.providerId = `MP${timestamp}${randomStr}`.toUpperCase();
    
    // Generate SHA256 hash for QR code
    const crypto = require('crypto');
    const qrData = `${this.providerId}-${this.email}-${timestamp}`;
    this.qrCode = {
      hash: crypto.createHash('sha256').update(qrData).digest('hex'),
      generatedAt: new Date(),
    };
  }
  next();
});

export default mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', ServiceProviderSchema);