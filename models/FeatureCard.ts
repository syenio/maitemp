import mongoose from 'mongoose';

const FeatureCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 300,
  },
  icon: {
    type: String,
    required: true,
    enum: [
      'Home', 'ChefHat', 'Baby', 'Shirt', 'Shield', 'Star', 'Clock', 'Users',
      'CheckCircle', 'Heart', 'Zap', 'Award', 'Truck', 'Phone', 'MapPin',
      'Calendar', 'CreditCard', 'Headphones', 'ThumbsUp', 'Gift'
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ['service', 'trust', 'carousel-feature'],
  },
  price: {
    type: String, // For service cards
  },
  features: [{
    type: String, // For service cards
  }],
  stat: {
    type: String, // For trust cards (e.g., "4.9/5 Rating")
  },
  link: {
    type: String,
    default: '/services',
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  textColor: {
    type: String,
    default: '#000000',
  },
  iconColor: {
    type: String,
    default: '#000000',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  popular: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
FeatureCardSchema.index({ type: 1, isActive: 1, order: 1 });

// Static method to get active cards by type
FeatureCardSchema.statics.getActiveCardsByType = function(type: string) {
  return this.find({
    type,
    isActive: true,
  }).sort({ order: 1, createdAt: -1 });
};

export default mongoose.models.FeatureCard || mongoose.model('FeatureCard', FeatureCardSchema);