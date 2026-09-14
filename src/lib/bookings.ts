import {
  Timestamp,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import { cancelPaymentIntent, refundBooking } from "./payments";
import type { Booking, BookingStatus, PaymentStatus, Ride } from "./types";

const toDate = (value: unknown): Date =>
  value instanceof Timestamp ? value.toDate() : new Date(value as string);

export function bookingFromDoc(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): Booking {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    rideId: data.rideId ?? "",
    passengerId: data.passengerId ?? "",
    passengerName: data.passengerName ?? "",
    driverId: data.driverId ?? "",
    driverName: data.driverName ?? "",
    seatsBooked: Number(data.seatsBooked ?? 1),
    status: (data.status as BookingStatus) ?? "pending",
    timestamp: toDate(data.timestamp),
    departure: data.departure ?? "",
    destination: data.destination ?? "",
    rideDate: toDate(data.rideDate),
    rideTime: toDate(data.rideTime),
    price: Number(data.price ?? 0),
    paymentStatus: (data.paymentStatus as PaymentStatus) ?? "pending",
    amountPaid: Number(data.amountPaid ?? 0),
    driverEarnings:
      data.driverEarnings != null ? Number(data.driverEarnings) : undefined,
    paymentMethod: data.paymentMethod ?? "stripe",
    paymentIntentId: data.paymentIntentId ?? undefined,
    note: data.note ?? undefined,
    voucherCode: data.voucherCode ?? undefined,
    voucherDiscount:
      data.voucherDiscount != null ? Number(data.voucherDiscount) : undefined,
  };
}

/**
 * Creates the booking document. Mirrors BookingService.createBooking:
 * status starts as `pending`, seats are NOT deducted until the driver confirms,
 * and the transaction still guards against overbooking.
 */
export async function createBooking({
  ride,
  passengerId,
  passengerName,
  seatsBooked,
  note,
  paymentIntentId,
  amountPaidByPassenger,
}: {
  ride: Ride;
  passengerId: string;
  passengerName: string;
  seatsBooked: number;
  note?: string;
  paymentIntentId?: string;
  amountPaidByPassenger: number;
}): Promise<string> {
  const db = getDb();
  const subtotal = ride.price * seatsBooked;

  return runTransaction(db, async (transaction) => {
    const rideRef = doc(db, "rides", ride.id);
    const rideSnapshot = await transaction.get(rideRef);
    if (!rideSnapshot.exists()) throw new Error("This ride no longer exists.");

    const currentSeats = Number(rideSnapshot.data()?.availableSeats ?? 0);
    if (currentSeats < seatsBooked) {
      throw new Error(
        `Only ${currentSeats} seat${currentSeats === 1 ? "" : "s"} left on this ride.`,
      );
    }

    const bookingRef = doc(collection(db, "bookings"));
    transaction.set(bookingRef, {
      rideId: ride.id,
      passengerId,
      passengerName,
      driverId: ride.riderId,
      driverName: ride.riderName,
      seatsBooked,
      status: "pending" satisfies BookingStatus,
      timestamp: Timestamp.fromDate(new Date()),
      departure: ride.departure,
      destination: ride.destination,
      rideDate: Timestamp.fromDate(ride.date),
      rideTime: Timestamp.fromDate(ride.time),
      price: ride.price,
      paymentStatus: "pending" satisfies PaymentStatus,
      amountPaid: amountPaidByPassenger,
      driverEarnings: subtotal,
      paymentMethod: "stripe",
      paymentIntentId: paymentIntentId ?? null,
      note: note ?? null,
      payoutProcessed: false,
    });

    return bookingRef.id;
  });
}

export function subscribeToPassengerBookings(
  passengerId: string,
  onBookings: (bookings: Booking[]) => void,
): () => void {
  if (!isFirebaseConfigured) {
    onBookings([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(getDb(), "bookings"), where("passengerId", "==", passengerId)),
    (snapshot) =>
      onBookings(
        snapshot.docs
          .map(bookingFromDoc)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      ),
  );
}

export function subscribeToDriverBookings(
  driverId: string,
  onBookings: (bookings: Booking[]) => void,
): () => void {
  if (!isFirebaseConfigured) {
    onBookings([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(getDb(), "bookings"), where("driverId", "==", driverId)),
    (snapshot) =>
      onBookings(
        snapshot.docs
          .map(bookingFromDoc)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      ),
  );
}

export async function fetchBookingsForRide(rideId: string): Promise<Booking[]> {
  if (!isFirebaseConfigured) return [];
  const snapshot = await getDocs(
    query(collection(getDb(), "bookings"), where("rideId", "==", rideId)),
  );
  return snapshot.docs.map(bookingFromDoc);
}

/**
 * Driver accepts a request: seats are deducted here, exactly like
 * BookingService.confirmBooking.
 */
export async function confirmBooking(booking: Booking): Promise<void> {
  const db = getDb();
  await runTransaction(db, async (transaction) => {
    const rideRef = doc(db, "rides", booking.rideId);
    const bookingRef = doc(db, "bookings", booking.id);
    const rideSnapshot = await transaction.get(rideRef);
    if (!rideSnapshot.exists()) throw new Error("This ride no longer exists.");

    const currentSeats = Number(rideSnapshot.data()?.availableSeats ?? 0);
    if (currentSeats < booking.seatsBooked) {
      throw new Error("Not enough seats left to accept this request.");
    }

    transaction.update(bookingRef, {
      status: "confirmed" satisfies BookingStatus,
      paymentStatus: "pending" satisfies PaymentStatus,
    });
    transaction.update(rideRef, {
      availableSeats: currentSeats - booking.seatsBooked,
      bookedSeats:
        Number(rideSnapshot.data()?.bookedSeats ?? 0) + booking.seatsBooked,
    });
  });
}

/** Driver declines: release the card authorization and cancel the booking. */
export async function declineBooking(booking: Booking): Promise<void> {
  if (booking.paymentIntentId) {
    await cancelPaymentIntent(booking.paymentIntentId);
  }
  await updateDoc(doc(getDb(), "bookings", booking.id), {
    status: "cancelled" satisfies BookingStatus,
    paymentStatus: "refunded" satisfies PaymentStatus,
    declinedAt: Timestamp.fromDate(new Date()),
  });
}

export const CANCELLATION_CUTOFF_HOURS = 2;

/**
 * Passenger cancels. Confirmed bookings return the seats to the ride, and the
 * payment authorization is released (or refunded if already captured).
 */
export async function cancelBooking(booking: Booking, rideDateTime: Date) {
  const hoursUntilDeparture =
    (rideDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilDeparture < CANCELLATION_CUTOFF_HOURS) {
    throw new Error(
      `Bookings can't be cancelled within ${CANCELLATION_CUTOFF_HOURS} hours of departure. Message the driver instead.`,
    );
  }

  if (booking.paymentStatus === "succeeded") {
    await refundBooking(booking.id);
  } else if (booking.paymentIntentId) {
    await cancelPaymentIntent(booking.paymentIntentId);
  }

  const db = getDb();
  await runTransaction(db, async (transaction) => {
    const rideRef = doc(db, "rides", booking.rideId);
    const bookingRef = doc(db, "bookings", booking.id);
    const rideSnapshot = await transaction.get(rideRef);

    transaction.update(bookingRef, {
      status: "cancelled" satisfies BookingStatus,
      paymentStatus: "refunded" satisfies PaymentStatus,
      cancelledAt: Timestamp.fromDate(new Date()),
    });

    // Only confirmed bookings ever held seats.
    if (rideSnapshot.exists() && booking.status === "confirmed") {
      const currentSeats = Number(rideSnapshot.data()?.availableSeats ?? 0);
      const bookedSeats = Number(rideSnapshot.data()?.bookedSeats ?? 0);
      transaction.update(rideRef, {
        availableSeats: currentSeats + booking.seatsBooked,
        bookedSeats: Math.max(0, bookedSeats - booking.seatsBooked),
      });
    }
  });
}
