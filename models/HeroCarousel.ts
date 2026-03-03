import mongoose from 'mongoose';

const HeroCarouselSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  subtitle: {
    type: String,
    maxlength: 200,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    enum: ['primary', 'secondary', 'accent', 'dark', 'light', 'gradient'],
    default: 'primary',
  },
  backgroundColor: {
    type: String,
    default: '#000000',
  },
  textColor: {
    type: String,
    default: '#ffffff',
  },
  buttonText: {
    type: String,
    default: 'Book Now',
  },
  buttonLink: {
    type: String,
    default: '/services',
  },
  buttonColor: {
    type: String,
    default: '#ffffff',
  },
  buttonBackgroundColor: {
    type: String,
    default: '#000000',
  },
  overlayOpacity: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.4,
  },
  textAlignment: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'left',
  },
  contentPosition: {
    type: String,
    enum: ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    default: 'center-left',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  targetAudience: {
    type: String,
    enum: ['all', 'new-users', 'returning-users', 'premium-users'],
    default: 'all',
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: String,
    default: 'admin',
  },
  hasCards: {
    type: Boolean,
    default: false,
  },
  cards: [{
    title: {
      type: String,
      required: function() { return this.parent().hasCards; },
      maxlength: 100,
    },
    description: {
      type: String,
      required: function() { return this.parent().hasCards; },
      maxlength: 200,
    },
    icon: {
      type: String,
      required: function() { return this.parent().hasCards; },
      enum: [
        'Home', 'ChefHat', 'Baby', 'Shirt', 'Shield', 'Star', 'Clock', 'Users',
        'CheckCircle', 'Heart', 'Zap', 'Award', 'Truck', 'Phone', 'MapPin',
        'Calendar', 'CreditCard', 'Headphones', 'ThumbsUp', 'Gift'
      ],
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
    order: {
      type: Number,
      default: 0,
    },
  }],
}, {
  timestamps: true,
});

// Index for efficient querying
HeroCarouselSchema.index({ isActive: 1, order: 1 });
HeroCarouselSchema.index({ startDate: 1, endDate: 1 });

// Method to check if slide is currently active
HeroCarouselSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  const isWithinDateRange = (!this.startDate || this.startDate <= now) && 
                           (!this.endDate || this.endDate >= now);
  return this.isActive && isWithinDateRange;
};

// Static method to get active slides
HeroCarouselSchema.statics.getActiveSlides = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    $or: [
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: { $lte: now }, endDate: null },
      { startDate: null, endDate: { $gte: now } },
      { startDate: null, endDate: null }
    ]
  }).sort({ order: 1, createdAt: -1 });
};

export default mongoose.models.HeroCarousel || mongoose.model('HeroCarousel', HeroCarouselSchema);