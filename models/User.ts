import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Not required for Google OAuth users
  },
  phone: {
    type: String,
    default: '',
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  googleId: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Ensure googleId is unique when present
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);