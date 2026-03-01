import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  scheduledTime: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    landmark: String,
  },
  specialInstructions: String,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [CartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'checkout_initiated', 'payment_pending', 'abandoned', 'converted'],
    default: 'active',
  },
  checkoutInitiatedAt: Date,
  paymentInitiatedAt: Date,
  abandonedAt: Date,
  sessionId: String, // For tracking user sessions
  lastActivity: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Auto-update lastActivity on any cart modification
CartSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Calculate total amount
CartSchema.methods.calculateTotal = async function() {
  await this.populate('items.service');
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.service.price * item.quantity);
  }, 0);
  return this.totalAmount;
};

// Mark cart as abandoned if inactive for too long
CartSchema.statics.markAbandonedCarts = async function() {
  const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes
  
  return this.updateMany(
    {
      status: { $in: ['checkout_initiated', 'payment_pending'] },
      lastActivity: { $lt: cutoffTime },
    },
    {
      status: 'abandoned',
      abandonedAt: new Date(),
    }
  );
};

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);