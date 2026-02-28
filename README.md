# MaidEase - Complete Professional Home Services Platform

A comprehensive e-commerce platform for booking maid services built with Next.js 16, MongoDB, Razorpay, and NextAuth. Features complete user authentication, service provider management, review system, and admin panel.

## 🚀 Features

### **User Features**
- **Google OAuth Authentication**: Secure login with Google accounts via NextAuth
- **Service Catalog**: Browse and filter various maid services by category
- **Advanced Booking System**: Schedule services with date/time selection and address
- **Payment Integration**: Secure payments via Razorpay gateway
- **User Dashboard**: Track bookings, payment status, and service history
- **Profile Management**: Update personal information, addresses, and preferences
- **Review & Rating System**: Rate services and service providers after completion
- **Notifications**: Real-time updates on booking status and important events
- **Booking Management**: Cancel or reschedule bookings with time-based policies

### **Service Provider Features**
- **Provider Registration**: Complete onboarding with document verification
- **Provider Dashboard**: Manage assigned bookings and update service status
- **Availability Management**: Set working hours and availability calendar
- **Profile Management**: Update bio, specializations, and service offerings
- **Rating System**: Receive and respond to customer reviews
- **Earnings Tracking**: Monitor completed services and payments

### **Admin Features**
- **Comprehensive Admin Panel**: Complete platform management dashboard
- **User Management**: View and manage all registered users
- **Service Management**: Create, edit, and manage service offerings
- **Service Provider Management**: Verify, activate, and manage service providers
- **Booking Management**: Monitor all bookings and assign service providers
- **Review Moderation**: Manage customer reviews and respond to feedback
- **Analytics Dashboard**: Track platform statistics and performance metrics
- **Hardcoded Admin Authentication**: Secure admin access with multi-factor authentication

### **Technical Features**
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS 4
- **File Upload System**: Cloudinary integration for image uploads
- **Real-time Updates**: Live booking status updates and notifications
- **Advanced Search**: Filter services by category, rating, and availability
- **Payment Security**: Razorpay signature verification and secure transactions
- **Data Validation**: Comprehensive form validation and error handling
- **SEO Optimized**: Next.js 16 with proper meta tags and structure

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Google OAuth, JWT for admin
- **Payment**: Razorpay Payment Gateway
- **File Storage**: Cloudinary for image uploads
- **Database**: MongoDB with comprehensive data models
- **UI Components**: Custom component library with Lucide React icons
- **Styling**: Tailwind CSS with custom design system

## 📊 Database Models

### Core Models
- **User**: Customer profiles with Google OAuth integration
- **Service**: Service catalog with categories and pricing
- **Booking**: Complete booking lifecycle management
- **ServiceProvider**: Provider profiles with verification status
- **Review**: Customer feedback with aspect-based ratings
- **Notification**: Real-time user notifications

### Advanced Features
- **Service Provider Assignment**: Automatic and manual assignment logic
- **Review Moderation**: Admin response system for customer feedback
- **Booking Status Tracking**: Complete lifecycle from booking to completion
- **Payment Verification**: Secure Razorpay integration with signature validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- Razorpay account for payment processing
- Google OAuth credentials for user authentication
- Cloudinary account for file uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maidease
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Update the `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/maid-booking
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   
   # Razorpay Payment
   RAZORPAY_KEY_ID=your-razorpay-key-id-here
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret-here
   
   # Cloudinary File Upload
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Admin Credentials
   ADMIN_EMAIL=admin@maidease.com
   ADMIN_PASSWORD=Admin@123456
   ADMIN_SECRET_KEY=super-secret-admin-key-2024
   
   # Legacy (for backward compatibility)
   JWT_SECRET=your-jwt-secret-key-here
   ```

4. **Database Setup**
   
   Start MongoDB and seed initial services:
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication (NextAuth + Admin)
│   │   ├── bookings/          # Booking management
│   │   ├── payment/           # Payment processing
│   │   ├── reviews/           # Review system
│   │   ├── service-providers/ # Provider management
│   │   ├── services/          # Service catalog
│   │   ├── upload/            # File upload
│   │   └── user/              # User profile & notifications
│   ├── admin/                 # Admin panel pages
│   │   ├── reviews/           # Review management
│   │   └── service-providers/ # Provider management
│   ├── auth/                  # Authentication pages
│   │   ├── admin/             # Admin login
│   │   └── signin/            # User Google OAuth
│   ├── booking/               # Booking flow
│   ├── dashboard/             # User dashboard
│   ├── profile/               # User profile management
│   ├── service-provider/      # Provider dashboard & registration
│   ├── services/              # Service catalog
│   └── layout.tsx             # Root layout with NextAuth provider
├── components/                # Reusable UI components
│   ├── ui/                    # Base UI components
│   ├── FileUpload.tsx         # File upload component
│   ├── ReviewCard.tsx         # Review display component
│   ├── ReviewForm.tsx         # Review submission form
│   └── ServiceProviderCard.tsx # Provider display component
├── lib/                       # Utility libraries
│   ├── adminAuth.ts           # Admin authentication helpers
│   ├── auth.ts                # JWT utilities (legacy)
│   ├── cloudinary.ts          # File upload integration
│   ├── mongodb.ts             # Database connection
│   ├── razorpay.ts            # Payment integration
│   └── utils.ts               # Common utilities
├── models/                    # Mongoose database models
│   ├── Booking.ts             # Booking with full lifecycle
│   ├── Notification.ts        # User notifications
│   ├── Review.ts              # Customer reviews
│   ├── Service.ts             # Service catalog
│   ├── ServiceProvider.ts     # Provider profiles
│   └── User.ts                # User profiles with Google OAuth
├── types/                     # TypeScript type definitions
│   └── next-auth.d.ts         # NextAuth type extensions
└── scripts/
    └── seed-services.js       # Database seeding script
```

## 🔐 Authentication System

### User Authentication
- **Google OAuth**: Seamless login with Google accounts
- **NextAuth.js**: Secure session management
- **Automatic Registration**: Create user profiles from Google data
- **Session Persistence**: Maintain login state across browser sessions

### Admin Authentication
- **Multi-Factor Security**: Email + Password + Secret Key
- **Hardcoded Credentials**: Environment-based admin accounts
- **Separate Login Flow**: Dedicated admin authentication system
- **Role-Based Access**: Secure admin-only API endpoints

## 💳 Payment Integration

### Razorpay Features
- **Secure Payments**: Industry-standard payment processing
- **Multiple Payment Methods**: Cards, UPI, Net Banking, Wallets
- **Payment Verification**: Server-side signature validation
- **Order Management**: Complete payment lifecycle tracking
- **Refund Support**: Automated refund processing for cancellations

## 📱 API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth Google OAuth
- `POST /api/auth/admin/login` - Admin authentication

### User Management
- `GET/PATCH /api/user/profile` - User profile management
- `GET /api/user/notifications` - User notifications
- `PATCH /api/user/notifications/[id]/read` - Mark notification as read

### Services & Bookings
- `GET /api/services` - Service catalog
- `GET/POST /api/bookings` - Booking management
- `PATCH /api/bookings/[id]/cancel` - Cancel booking
- `PATCH /api/bookings/[id]/reschedule` - Reschedule booking
- `POST /api/bookings/[id]/assign` - Assign service provider
- `PATCH /api/bookings/[id]/status` - Update booking status

### Reviews & Ratings
- `GET/POST /api/reviews` - Review management
- `PATCH/DELETE /api/reviews/[id]` - Review moderation

### Service Providers
- `GET/POST /api/service-providers` - Provider management
- `GET/PATCH/DELETE /api/service-providers/[id]` - Individual provider

### Admin Endpoints
- `GET /api/admin/users` - User management
- `GET/POST /api/admin/services` - Service management
- `GET/PATCH /api/admin/bookings` - Booking management

### File Upload
- `POST /api/upload` - Cloudinary file upload

## 🎨 UI Components

### Base Components
- **Button**: Customizable button with variants
- **Input**: Form input with validation styles
- **Card**: Container component with header/content/footer
- **Badge**: Status and category indicators
- **Modal**: Overlay dialogs for forms and details
- **Rating**: Interactive star rating component

### Feature Components
- **FileUpload**: Drag-and-drop file upload with preview
- **ReviewCard**: Customer review display with ratings
- **ReviewForm**: Review submission with aspect ratings
- **ServiceProviderCard**: Provider profile display

## 🔧 Configuration

### Required Services

1. **MongoDB Setup**
   - Local: Install MongoDB Community Edition
   - Cloud: Create MongoDB Atlas cluster
   - Connection string in `MONGODB_URI`

2. **Google OAuth Setup**
   - Create project in Google Cloud Console
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

3. **Razorpay Setup**
   - Create Razorpay account
   - Generate API keys from dashboard
   - Configure webhook endpoints (optional)

4. **Cloudinary Setup**
   - Create Cloudinary account
   - Get cloud name and API credentials
   - Configure upload presets (optional)

## 🚀 Deployment

### Environment Variables
Ensure all environment variables are set in production:
- Database connection strings
- API keys and secrets
- OAuth credentials
- Admin credentials (secure)

### Build Process
```bash
npm run build
npm start
```

### Recommended Platforms
- **Vercel**: Optimal for Next.js applications
- **Netlify**: Alternative with good Next.js support
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: VPS deployment with Docker

## 📈 Performance Features

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: MongoDB connection pooling and query optimization
- **Lazy Loading**: Component-based lazy loading
- **Compression**: Automatic asset compression

## 🔒 Security Features

- **Input Validation**: Comprehensive form and API validation
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: React built-in XSS prevention
- **CSRF Protection**: NextAuth CSRF token validation
- **Rate Limiting**: API endpoint rate limiting (recommended)
- **File Upload Security**: File type and size validation

## 🧪 Testing

### Recommended Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user flow testing
- **Payment Testing**: Razorpay test mode integration

## 📞 Support

For technical support or questions:
- Check the documentation in `/docs` (if available)
- Review API endpoint documentation
- Test with provided sample data
- Verify environment variable configuration

## 🎯 Future Enhancements

### Planned Features
- **Real-time Chat**: Customer-provider communication
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed reporting dashboard
- **Multi-language Support**: Internationalization
- **Subscription Plans**: Recurring service bookings
- **Loyalty Program**: Customer reward system
- **Advanced Scheduling**: Calendar integration
- **Push Notifications**: Real-time mobile notifications

---

**MaidEase** - Complete professional home services platform with modern architecture and comprehensive features.