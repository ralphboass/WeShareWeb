export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  fcmToken?: string;
  numberOfTrips: number;
  address?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  walletBalance: number;
  balance?: number;
  driverRating?: number;
  driverReviewCount?: number;
  passengerRating?: number;
  passengerReviewCount?: number;
  uclaVerified?: boolean;
  biography?: string;
  stripeConnectAccountId?: string;
}

export interface Ride {
  id: string;
  riderId: string;
  riderName: string;
  departure: string;
  departureAddress: string;
  destination: string;
  destinationAddress: string;
  date: Date;
  time: Date;
  availableSeats: number;
  totalSeats?: number;
  price: number;
  isCancelled?: boolean;
  note?: string;
  createdAt?: Date;
  status?: 'scheduled' | 'finished' | 'completed';
  isUber?: boolean;
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  passengerName: string;
  driverId: string;
  driverName: string;
  seatsBooked: number;
  status: 'pending' | 'payment_required' | 'confirmed' | 'cancelled' | 'completed';
  timestamp: Date;
  departure: string;
  destination: string;
  rideDate: Date;
  rideTime: Date;
  price: number;
  paymentStatus: 'pending' | 'succeeded' | 'failed' | 'refunded';
  amountPaid: number;
  driverEarnings?: number;
  paymentMethod: string;
  paymentIntentId?: string;
  note?: string;
}

export interface Chat {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
  rideId?: string;
  status?: 'sent' | 'delivered' | 'read';
  isSystemMessage?: boolean;
}

export interface RideSearch {
  departure: string;
  destination: string;
  date: Date;
  passengers: number;
  maxPrice?: number;
}
