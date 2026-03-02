const mongoose = require('mongoose');
require('dotenv').config();

// Define the schema directly since we can't import the model
const HeroCarouselSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  subtitle: { type: String, maxlength: 200 },
  description: { type: String, maxlength: 500 },
  imageUrl: { type: String, required: true },
  theme: { type: String, enum: ['primary', 'secondary', 'accent', 'dark', 'light', 'gradient'], default: 'primary' },
  backgroundColor: { type: String, default: '#000000' },
  textColor: { type: String, default: '#ffffff' },
  buttonText: { type: String, default: 'Book Now' },
  buttonLink: { type: String, default: '/services' },
  buttonColor: { type: String, default: '#ffffff' },
  buttonBackgroundColor: { type: String, default: '#000000' },
  overlayOpacity: { type: Number, min: 0, max: 1, default: 0.4 },
  textAlignment: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
  contentPosition: { type: String, enum: ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'], default: 'center-left' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  targetAudience: { type: String, enum: ['all', 'new-users', 'returning-users', 'premium-users'], default: 'all' },
  clickCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  createdBy: { type: String, default: 'admin' },
}, { timestamps: true });

const HeroCarousel = mongoose.model('HeroCarousel', HeroCarouselSchema);

const carouselSlides = [
  {
    title: 'Professional Home Cleaning',
    subtitle: 'Trusted & Verified Maids',
    description: 'Book experienced, background-verified cleaning professionals for your home. Quality service guaranteed with 100% satisfaction.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop&q=80',
    theme: 'primary',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    buttonText: 'Book Cleaning Service',
    buttonLink: '/services',
    buttonColor: '#000000',
    buttonBackgroundColor: '#ffffff',
    overlayOpacity: 0.6,
    textAlignment: 'left',
    contentPosition: 'center-left',
    isActive: true,
    order: 1,
    targetAudience: 'all',
  },
  {
    title: 'Expert Cooking Services',
    subtitle: 'Delicious Home-Cooked Meals',
    description: 'Professional chefs at your service. Enjoy restaurant-quality meals prepared fresh in your home kitchen.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&q=80',
    theme: 'accent',
    backgroundColor: '#2563eb',
    textColor: '#ffffff',
    buttonText: 'Find a Cook',
    buttonLink: '/services',
    buttonColor: '#ffffff',
    buttonBackgroundColor: '#1d4ed8',
    overlayOpacity: 0.5,
    textAlignment: 'center',
    contentPosition: 'center',
    isActive: true,
    order: 2,
    targetAudience: 'all',
  },
  {
    title: 'Complete Laundry Solutions',
    subtitle: 'Fresh, Clean, Convenient',
    description: 'Professional laundry and dry cleaning services. We pick up, clean with care, and deliver back to you.',
    imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&h=600&fit=crop&q=80',
    theme: 'secondary',
    backgroundColor: '#6b7280',
    textColor: '#ffffff',
    buttonText: 'Get Started',
    buttonLink: '/services',
    buttonColor: '#ffffff',
    buttonBackgroundColor: '#4b5563',
    overlayOpacity: 0.7,
    textAlignment: 'right',
    contentPosition: 'center-right',
    isActive: true,
    order: 3,
    targetAudience: 'all',
  },
  {
    title: 'Child & Elder Care',
    subtitle: 'Compassionate Care Services',
    description: 'Experienced caregivers for your loved ones. Reliable, caring, and professional support when you need it most.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=600&fit=crop&q=80',
    theme: 'gradient',
    backgroundColor: '#8b5cf6',
    textColor: '#ffffff',
    buttonText: 'Book Care Service',
    buttonLink: '/services',
    buttonColor: '#ffffff',
    buttonBackgroundColor: '#7c3aed',
    overlayOpacity: 0.4,
    textAlignment: 'left',
    contentPosition: 'bottom-left',
    isActive: true,
    order: 4,
    targetAudience: 'all',
  },
  {
    title: 'Join Our Provider Network',
    subtitle: 'Start Your Service Business',
    description: 'Become a verified service provider and connect with customers in your area. Grow your business with MaidEase.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop&q=80',
    theme: 'dark',
    backgroundColor: '#111827',
    textColor: '#ffffff',
    buttonText: 'Join as Provider',
    buttonLink: '/service-provider/register',
    buttonColor: '#111827',
    buttonBackgroundColor: '#ffffff',
    overlayOpacity: 0.8,
    textAlignment: 'center',
    contentPosition: 'center',
    isActive: true,
    order: 5,
    targetAudience: 'new-users',
  },
];

async function seedCarousel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing carousel slides
    await HeroCarousel.deleteMany({});
    console.log('Cleared existing carousel slides');

    // Insert new slides
    const insertedSlides = await HeroCarousel.insertMany(carouselSlides);
    console.log(`✅ Successfully seeded ${insertedSlides.length} carousel slides:`);
    
    insertedSlides.forEach((slide, index) => {
      console.log(`${index + 1}. ${slide.title} (${slide.theme} theme)`);
    });

    console.log('\n🎉 Carousel seeding completed successfully!');
    console.log('You can now manage these slides in the admin panel at /admin/hero-carousel');
    
  } catch (error) {
    console.error('❌ Error seeding carousel:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding
seedCarousel();