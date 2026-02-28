# WeShare Web Setup Guide

## Overview
This is the redesigned WeShare website with full ride-sharing functionality including:
- Ride search and browsing with interactive map
- User authentication (sign up/login)
- Ride booking system
- User profile and dashboard
- Messaging interface
- Responsive design for mobile and desktop

## Prerequisites
- Node.js 18+ installed
- Firebase project set up
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   
   Create a `.env.local` file in the root directory with your Firebase configuration:
   
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   You can find these values in your Firebase Console under Project Settings.

3. **Set up Firestore Database:**
   
   Create the following collections in Firestore:
   - `users` - User profiles
   - `rides` - Available rides
   - `bookings` - Ride bookings
   - `chats` - Messages between users

   Firestore Security Rules (basic example):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == userId;
       }
       
       match /rides/{rideId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update, delete: if request.auth.uid == resource.data.riderId;
       }
       
       match /bookings/{bookingId} {
         allow read: if request.auth != null && 
           (request.auth.uid == resource.data.passengerId || 
            request.auth.uid == resource.data.driverId);
         allow create: if request.auth != null;
         allow update: if request.auth != null && 
           (request.auth.uid == resource.data.passengerId || 
            request.auth.uid == resource.data.driverId);
       }
       
       match /chats/{chatId} {
         allow read: if request.auth != null && 
           (request.auth.uid == resource.data.senderId || 
            request.auth.uid == resource.data.receiverId);
         allow create: if request.auth != null;
       }
     }
   }
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
WeShareWeb/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page with search & map
│   ├── rides/               # Rides listing and details
│   ├── login/               # Authentication pages
│   ├── signup/
│   ├── profile/             # User profile
│   ├── messages/            # Chat interface
│   └── layout.tsx           # Root layout with navbar
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   └── RideMap.tsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/                 # Utilities
│   │   └── firebase.ts
│   └── types/               # TypeScript types
│       └── index.ts
└── public/                  # Static assets
```

## Key Features

### 1. Home Page (`/`)
- Ride search form with departure, destination, date, and passenger count
- Interactive map showing available rides
- Call-to-action sections

### 2. Rides List (`/rides`)
- Browse all available rides
- Filter by location, date, and passenger count
- View ride details and driver information

### 3. Ride Details (`/rides/[id]`)
- Detailed ride information
- Booking interface (requires login)
- Driver profile and contact option

### 4. Authentication
- Sign up with email/password
- Login with existing account
- Protected routes redirect to login

### 5. Profile (`/profile`)
- User information and stats
- Wallet balance
- My rides (as driver)
- My bookings (as passenger)

### 6. Messages (`/messages`)
- List of conversations
- Chat with drivers/passengers
- Unread message indicators

## Authentication Flow

1. **Browsing**: Users can browse rides without logging in
2. **Booking**: Login required when attempting to book a ride
3. **Creating Rides**: Login required to create rides
4. **Messaging**: Login required to access messages

## Next Steps for Production

1. **Payment Integration**: Integrate Stripe for ride payments
2. **Real-time Chat**: Implement WebSocket or Firebase Realtime Database for live messaging
3. **Email Notifications**: Set up email service for booking confirmations
4. **Push Notifications**: Add web push notifications for messages and bookings
5. **Geocoding**: Integrate Google Maps API for address autocomplete and accurate mapping
6. **Reviews & Ratings**: Add review system for drivers and passengers
7. **Admin Panel**: Create admin interface for managing users and rides
8. **Analytics**: Add Google Analytics or similar for tracking

## Environment Variables

Required environment variables in `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional: For production
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Docker

## Troubleshooting

**Firebase errors:**
- Ensure `.env.local` is properly configured
- Check Firebase Console for authentication and Firestore setup
- Verify security rules allow read/write operations

**Map not loading:**
- Check Leaflet CSS is loaded in layout.tsx
- Ensure rides have valid coordinates (geocoding needed)

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`

## Support

For issues or questions:
- Check the iOS app codebase for backend logic reference
- Review Firebase documentation for database queries
- Contact the development team

## License

© 2025 WeShare. All rights reserved.
