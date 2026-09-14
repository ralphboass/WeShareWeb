/**
 * Types mirroring the Firestore documents written by the WeShare iOS app.
 * Field names must stay identical to the Swift models in app1/Models.
 */

export type RideStatus = "scheduled" | "finished" | "completed";

export interface Ride {
  id: string;
  riderId: string;
  riderName: string;
  departure: string;
  departureAddress: string;
  destination: string;
  destinationAddress: string;
  /** Date component (stored as a Firestore Timestamp) */
  date: Date;
  /** Time component (stored as a Firestore Timestamp) */
  time: Date;
  /** date + time combined, computed client side like the app does */
  dateTime: Date;
  availableSeats: number;
  totalSeats?: number;
  bookedSeats?: number;
  price: number;
  isCancelled?: boolean;
  note?: string;
  createdAt?: Date;
  status?: RideStatus;
  carId?: string;
}

export type BookingStatus =
  | "pending"
  | "payment_required"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  passengerName: string;
  driverId: string;
  driverName: string;
  seatsBooked: number;
  status: BookingStatus;
  timestamp: Date;
  departure: string;
  destination: string;
  rideDate: Date;
  rideTime: Date;
  price: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  driverEarnings?: number;
  paymentMethod: string;
  paymentIntentId?: string;
  note?: string;
  voucherCode?: string;
  voucherDiscount?: number;
}

export interface UserCar {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  numberOfTrips: number;
  address?: string;
  cars?: UserCar[];
  emailVerified?: boolean;
  walletBalance: number;
  driverRating?: number;
  driverReviewCount?: number;
  passengerRating?: number;
  passengerReviewCount?: number;
  uclaVerified?: boolean;
  biography?: string;
  stripeConnectAccountId?: string;
}

export type MessageStatus = "sent" | "delivered" | "read";

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
  rideId?: string;
  status?: MessageStatus;
  isSystemMessage?: boolean;
}

export interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerImageUrl?: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

export interface Review {
  id: string;
  bookingId: string;
  rideId: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  revieweeName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  reviewType: "driver" | "passenger";
  departure?: string;
  destination?: string;
}

export const fullName = (u: Pick<UserProfile, "firstName" | "lastName">) =>
  `${u.firstName} ${u.lastName}`.trim();

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
