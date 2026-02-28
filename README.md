# MaidEase - Professional Home Services Platform

A modern e-commerce platform for booking maid services built with Next.js 16, MongoDB, and Razorpay integration.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Service Catalog**: Browse and filter various maid services by category
- **Booking System**: Schedule services with date/time selection and address
- **Payment Integration**: Secure payments via Razorpay gateway
- **User Dashboard**: Track bookings and payment status in real-time
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Payment**: Razorpay Payment Gateway
- **Authentication**: JWT tokens with bcryptjs
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- Razorpay account for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mai-ip
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Update the `.env.local` file in the root directory with your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/maid-booking
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   RAZORPAY_KEY_ID=your-razorpay-key-id-here
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret-here
   JWT_SECRET=your-jwt-secret-key-here
   ```

4. **Database Setup**
   
   Start MongoDB locally or ensure your MongoDB Atlas connection is working, then seed initial services:
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints (login, register)
│   │   ├── bookings/       # Booking management (create, list)
│   │   ├── payment/        # Payment processing (create-order, verify)
│   │   └── services/       # Service catalog (list, create)
│   ├── auth/               # Authentication pages (login, register)
│   ├── booking/            # Booking pages with service selection
│   ├── dashboard/          # User dashboard with booking history
│   ├── services/           # Service listing with category filters
│   ├── layout.tsx          # Root layout with Razorpay script
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── lib/                    # Utility libraries
│   ├── auth.ts            # Authentication helpers (JWT, bcrypt)
│   ├── mongodb.ts         # Database connection with caching
│   └── razorpay.ts        # Payment integration setup
├── models/                 # Mongoose database models
│   ├── Booking.ts         # Booking schema with payment tracking
│   ├── Service.ts         # Service schema with categories
│   └── User.ts            # User schema with address
├── scripts/
│   └── seed-services.js    # Database seeding script
├── .env.local              # Environment variables
└── package.json            # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User login with JWT token generation

### Services
- `GET /api/services` - Get all active services
- `POST /api/services` - Create new service (admin)

### Bookings
- `GET /api/bookings` - Get user bookings (requires authentication)
- `POST /api/bookings` - Create new booking (requires authentication)

### Payments
- `POST /api/payment/create-order` - Create Razorpay order for booking
- `POST /api/payment/verify` - Verify payment signature and update booking

## Usage Flow

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Browse Services**: View available maid services with category filters
3. **Book Service**: Select service, choose date/time, and provide address
4. **Make Payment**: Complete secure payment via Razorpay gateway
5. **Track Booking**: Monitor booking status and payment in dashboard

## Configuration

### Razorpay Setup
1. Create account at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Generate Test/Live API keys
4. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local`

### MongoDB Setup
- **Local**: Install MongoDB Community Edition and start service on port 27017
- **Cloud**: Create free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and use connection string

### JWT Secret Generation
Generate a secure random string for JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Service Categories

The application supports the following service categories:
- **Cleaning**: House cleaning, deep cleaning, kitchen cleaning
- **Cooking**: Daily meals, party cooking
- **Laundry**: Washing, drying, folding
- **Child Care**: Professional child supervision
- **Elder Care**: Elderly assistance and care
- **General**: Other household services

## Payment Flow

1. User creates booking with service details
2. System generates Razorpay order with booking amount
3. Razorpay checkout modal opens for payment
4. User completes payment with preferred method
5. Payment signature is verified on backend
6. Booking status updated to "confirmed" and payment marked as "paid"

## Security Features

- Password hashing with bcryptjs (12 rounds)
- JWT token-based authentication (7-day expiry)
- Razorpay signature verification for payments
- MongoDB connection with environment variables
- Protected API routes with token validation

## Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Seed database with services
```