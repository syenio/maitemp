const mongoose = require('mongoose');
require('dotenv').config();

// Define the schema directly since we can't import the model
const FeatureCardSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 300 },
  icon: { 
    type: String, 
    required: true,
    enum: [
      'Home', 'ChefHat', 'Baby', 'Shirt', 'Shield', 'Star', 'Clock', 'Users',
      'CheckCircle', 'Heart', 'Zap', 'Award', 'Truck', 'Phone', 'MapPin',
      'Calendar', 'CreditCard', 'Headphones', 'ThumbsUp', 'Gift'
    ]
  },
  type: { 
    type: String, 
    required: true,
    enum: ['service', 'trust', 'carousel-feature']
  },
  price: { type: String },
  features: [{ type: String }],
  stat: { type: String },
  link: { type: String, default: '/services' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#000000' },
  iconColor: { type: String, default: '#000000' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  popular: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const FeatureCard = mongoose.models.FeatureCard || mongoose.model('FeatureCard', FeatureCardSchema);

const featureCards = [
  // Service Cards
  {
    title: 'House Cleaning',
    description: 'Complete home cleaning service including all rooms, kitchen, and bathrooms.',
    icon: 'Home',
    type: 'service',
    price: 'Starting ₹299',
    features: ['Deep cleaning', 'Eco-friendly products', '2-3 hours service', 'Insured staff'],
    link: '/services',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    iconColor: '#000000',
    isActive: true,
    order: 1,
    popular: false,
  },
  {
    title: 'Cooking Service',
    description: 'Professional cooks for daily meals, special occasions, or meal prep.',
    icon: 'ChefHat',
    type: 'service',
    price: 'Starting ₹199',
    features: ['Custom menus', 'Fresh ingredients', 'Dietary preferences', 'Flexible timing'],
    link: '/services',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    iconColor: '#000000',
    isActive: true,
    order: 2,
    popular: true,
  },
  {
    title: 'Child Care',
    description: 'Experienced babysitters and nannies for your little ones.',
    icon: 'Baby',
    type: 'service',
    price: 'Starting ₹150/hr',
    features: ['Background verified', 'Trained caregivers', 'Activity planning', 'Emergency trained'],
    link: '/services',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    iconColor: '#000000',
    isActive: true,
    order: 3,
    popular: false,
  },
  {
    title: 'Laundry Service',
    description: 'Washing, ironing, and folding service for all your clothes.',
    icon: 'Shirt',
    type: 'service',
    price: 'Starting ₹99',
    features: ['Pickup & delivery', 'Same day service', 'Fabric care', 'Stain removal'],
    link: '/services',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    iconColor: '#000000',
    isActive: true,
    order: 4,
    popular: false,
  },

  // Trust Cards
  {
    title: 'Verified Professionals',
    description: 'All service providers undergo thorough background verification and training.',
    icon: 'Shield',
    type: 'trust',
    stat: '100% Verified',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    iconColor: '#000000',
    isActive: true,
    order: 1,
  },
  {
    title: 'Quality Guaranteed',
    description: 'We ensure top-quality service with our satisfaction guarantee policy.',
    icon: 'Star',
    type: 'trust',
    stat: '4.9/5 Rating',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    iconColor: '#000000',
    isActive: true,
    order: 2,
  },
  {
    title: 'On-Time Service',
    description: 'Punctual and reliable service delivery at your preferred time slot.',
    icon: 'Clock',
    type: 'trust',
    stat: '98% On-Time',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    iconColor: '#000000',
    isActive: true,
    order: 3,
  },

  // Carousel Feature Cards
  {
    title: 'Verified',
    description: 'Background checked',
    icon: 'Shield',
    type: 'carousel-feature',
    stat: '100% Verified',
    backgroundColor: 'rgba(255,255,255,0.1)',
    textColor: '#ffffff',
    iconColor: '#ffffff',
    isActive: true,
    order: 1,
  },
  {
    title: 'Rated 4.9/5',
    description: 'Customer satisfaction',
    icon: 'Star',
    type: 'carousel-feature',
    stat: '4.9/5 Rating',
    backgroundColor: 'rgba(255,255,255,0.1)',
    textColor: '#ffffff',
    iconColor: '#ffffff',
    isActive: true,
    order: 2,
  },
  {
    title: '24/7 Support',
    description: 'Always available',
    icon: 'Clock',
    type: 'carousel-feature',
    stat: '24/7 Available',
    backgroundColor: 'rgba(255,255,255,0.1)',
    textColor: '#ffffff',
    iconColor: '#ffffff',
    isActive: true,
    order: 3,
  },
  {
    title: '10k+ Customers',
    description: 'Trusted by many',
    icon: 'Users',
    type: 'carousel-feature',
    stat: '10k+ Happy',
    backgroundColor: 'rgba(255,255,255,0.1)',
    textColor: '#ffffff',
    iconColor: '#ffffff',
    isActive: true,
    order: 4,
  },
];

async function seedFeatureCards() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing feature cards
    await FeatureCard.deleteMany({});
    console.log('Cleared existing feature cards');

    // Insert new feature cards
    const insertedCards = await FeatureCard.insertMany(featureCards);
    console.log(`Inserted ${insertedCards.length} feature cards`);

    // Log summary
    const serviceCount = insertedCards.filter(card => card.type === 'service').length;
    const trustCount = insertedCards.filter(card => card.type === 'trust').length;
    const carouselCount = insertedCards.filter(card => card.type === 'carousel-feature').length;

    console.log('\nFeature Cards Summary:');
    console.log(`- Service Cards: ${serviceCount}`);
    console.log(`- Trust Cards: ${trustCount}`);
    console.log(`- Carousel Feature Cards: ${carouselCount}`);
    console.log(`- Total: ${insertedCards.length}`);

    console.log('\nFeature cards seeded successfully!');
  } catch (error) {
    console.error('Error seeding feature cards:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
seedFeatureCards();