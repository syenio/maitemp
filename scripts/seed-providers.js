const mongoose = require('mongoose');
require('dotenv').config();

// Define ServiceProvider schema (since we can't import the model directly)
const ServiceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  experience: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
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
    idProof: String,
    addressProof: String,
    experienceCertificate: String,
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
  },
  profileImage: String,
  bio: String,
  languages: [String],
  specializations: [String],
}, { timestamps: true });

const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', ServiceProviderSchema);

const sampleProviders = [
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91-9876543210",
    address: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001"
    },
    experience: 5,
    rating: 4.8,
    totalReviews: 127,
    isVerified: true,
    isActive: true,
    bio: "Experienced house cleaning professional with 5+ years of experience. Specializes in deep cleaning and eco-friendly products.",
    languages: ["Hindi", "English", "Marathi"],
    specializations: ["Deep Cleaning", "Kitchen Cleaning", "Bathroom Sanitization"],
    availability: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "17:00", available: true },
      saturday: { start: "10:00", end: "16:00", available: true },
      sunday: { start: "", end: "", available: false }
    }
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91-9876543211",
    address: {
      street: "456 CP Road",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001"
    },
    experience: 3,
    rating: 4.6,
    totalReviews: 89,
    isVerified: true,
    isActive: true,
    bio: "Professional cook with expertise in North Indian and Continental cuisine. Available for daily cooking and special occasions.",
    languages: ["Hindi", "English", "Punjabi"],
    specializations: ["North Indian Cuisine", "Continental Food", "Meal Prep"],
    availability: {
      monday: { start: "08:00", end: "20:00", available: true },
      tuesday: { start: "08:00", end: "20:00", available: true },
      wednesday: { start: "08:00", end: "20:00", available: true },
      thursday: { start: "08:00", end: "20:00", available: true },
      friday: { start: "08:00", end: "20:00", available: true },
      saturday: { start: "08:00", end: "20:00", available: true },
      sunday: { start: "10:00", end: "18:00", available: true }
    }
  },
  {
    name: "Anita Patel",
    email: "anita.patel@example.com",
    phone: "+91-9876543212",
    address: {
      street: "789 Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001"
    },
    experience: 7,
    rating: 4.9,
    totalReviews: 203,
    isVerified: true,
    isActive: true,
    bio: "Certified childcare professional with 7+ years of experience. Trained in first aid and child development.",
    languages: ["English", "Hindi", "Gujarati", "Kannada"],
    specializations: ["Infant Care", "Toddler Activities", "Educational Games"],
    availability: {
      monday: { start: "07:00", end: "19:00", available: true },
      tuesday: { start: "07:00", end: "19:00", available: true },
      wednesday: { start: "07:00", end: "19:00", available: true },
      thursday: { start: "07:00", end: "19:00", available: true },
      friday: { start: "07:00", end: "19:00", available: true },
      saturday: { start: "08:00", end: "18:00", available: true },
      sunday: { start: "", end: "", available: false }
    }
  },
  {
    name: "Meera Reddy",
    email: "meera.reddy@example.com",
    phone: "+91-9876543213",
    address: {
      street: "321 Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500033"
    },
    experience: 4,
    rating: 4.7,
    totalReviews: 156,
    isVerified: false,
    isActive: true,
    bio: "Compassionate elder care specialist with experience in medical assistance and companionship.",
    languages: ["Telugu", "English", "Hindi"],
    specializations: ["Elder Care", "Medical Assistance", "Companionship"],
    availability: {
      monday: { start: "06:00", end: "22:00", available: true },
      tuesday: { start: "06:00", end: "22:00", available: true },
      wednesday: { start: "06:00", end: "22:00", available: true },
      thursday: { start: "06:00", end: "22:00", available: true },
      friday: { start: "06:00", end: "22:00", available: true },
      saturday: { start: "06:00", end: "22:00", available: true },
      sunday: { start: "06:00", end: "22:00", available: true }
    }
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91-9876543214",
    address: {
      street: "654 FC Road",
      city: "Pune",
      state: "Maharashtra",
      zipCode: "411005"
    },
    experience: 2,
    rating: 4.4,
    totalReviews: 67,
    isVerified: true,
    isActive: true,
    bio: "Professional laundry and garment care specialist. Expert in fabric care and stain removal.",
    languages: ["Hindi", "English", "Marathi"],
    specializations: ["Laundry Service", "Dry Cleaning", "Stain Removal"],
    availability: {
      monday: { start: "08:00", end: "18:00", available: true },
      tuesday: { start: "08:00", end: "18:00", available: true },
      wednesday: { start: "08:00", end: "18:00", available: true },
      thursday: { start: "08:00", end: "18:00", available: true },
      friday: { start: "08:00", end: "18:00", available: true },
      saturday: { start: "09:00", end: "17:00", available: true },
      sunday: { start: "", end: "", available: false }
    }
  }
];

async function seedProviders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing providers
    console.log('Clearing existing service providers...');
    await ServiceProvider.deleteMany({});

    // Insert sample providers
    console.log('Inserting sample service providers...');
    const insertedProviders = await ServiceProvider.insertMany(sampleProviders);
    
    console.log(`Successfully inserted ${insertedProviders.length} service providers:`);
    insertedProviders.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.name} - ${provider.email}`);
    });

    console.log('Service providers seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding service providers:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedProviders();