import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import { demoRides } from "./demo-data";
import type { Ride, RideStatus } from "./types";

const toDate = (value: unknown, fallback = new Date()): Date => {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return fallback;
};

/** Combines the separate `date` and `time` fields exactly like Ride.dateTime does. */
export function combineDateTime(date: Date, time: Date): Date {
  const combined = new Date(date);
  combined.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
  return combined;
}

export function rideFromDoc(
  snapshot: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData | undefined },
): Ride {
  const data = snapshot.data() ?? {};
  const date = toDate(data.date);
  const time = toDate(data.time, date);
  return {
    id: snapshot.id,
    riderId: data.riderId ?? "",
    riderName: data.riderName ?? "Driver",
    departure: data.departure ?? "",
    departureAddress: data.departureAddress ?? "",
    destination: data.destination ?? "",
    destinationAddress: data.destinationAddress ?? "",
    date,
    time,
    dateTime: combineDateTime(date, time),
    availableSeats: Number(data.availableSeats ?? 0),
    totalSeats: data.totalSeats != null ? Number(data.totalSeats) : undefined,
    bookedSeats: data.bookedSeats != null ? Number(data.bookedSeats) : undefined,
    price: Number(data.price ?? 0),
    isCancelled: data.isCancelled ?? undefined,
    note: data.note ?? undefined,
    createdAt: data.createdAt ? toDate(data.createdAt) : undefined,
    status: (data.status as RideStatus) ?? undefined,
    carId: data.carId ?? undefined,
  };
}

/** Live list of rides, ordered by date like RideStore does. */
export function subscribeToRides(
  onRides: (rides: Ride[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!isFirebaseConfigured) {
    onRides(demoRides());
    return () => {};
  }
  const ridesQuery = query(collection(getDb(), "rides"), orderBy("date", "asc"));
  return onSnapshot(
    ridesQuery,
    (snapshot) => onRides(snapshot.docs.map(rideFromDoc)),
    (error) => onError?.(error),
  );
}

export async function fetchRide(rideId: string): Promise<Ride | null> {
  if (!isFirebaseConfigured) {
    return demoRides().find((ride) => ride.id === rideId) ?? null;
  }
  const snapshot = await getDoc(doc(getDb(), "rides", rideId));
  return snapshot.exists() ? rideFromDoc(snapshot) : null;
}

export async function fetchRidesByDriver(driverId: string): Promise<Ride[]> {
  if (!isFirebaseConfigured) return [];
  const snapshot = await getDocs(
    query(collection(getDb(), "rides"), where("riderId", "==", driverId)),
  );
  return snapshot.docs
    .map(rideFromDoc)
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
}

export interface RideSearchFilters {
  from?: string;
  to?: string;
  date?: string;
  seats?: number;
}

/**
 * Search filtering matches RideSearchView: case-insensitive substring match on
 * the short label and the full address, upcoming rides only.
 */
export function filterRides(rides: Ride[], filters: RideSearchFilters): Ride[] {
  const now = new Date();
  const from = filters.from?.trim().toLowerCase();
  const to = filters.to?.trim().toLowerCase();
  const seats = filters.seats ?? 0;

  return rides
    .filter((ride) => {
      if (ride.isCancelled) return false;
      if (ride.dateTime < now) return false;
      if (seats > 0 && ride.availableSeats < seats) return false;

      if (from) {
        const haystack = `${ride.departure} ${ride.departureAddress}`.toLowerCase();
        if (!haystack.includes(from)) return false;
      }
      if (to) {
        const haystack = `${ride.destination} ${ride.destinationAddress}`.toLowerCase();
        if (!haystack.includes(to)) return false;
      }
      if (filters.date) {
        const [year, month, day] = filters.date.split("-").map(Number);
        const rideDate = ride.date;
        if (
          rideDate.getFullYear() !== year ||
          rideDate.getMonth() + 1 !== month ||
          rideDate.getDate() !== day
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
}

export interface NewRideInput {
  riderId: string;
  riderName: string;
  departure: string;
  departureAddress: string;
  destination: string;
  destinationAddress: string;
  /** yyyy-MM-dd */
  date: string;
  /** HH:mm */
  time: string;
  availableSeats: number;
  price: number;
  note?: string;
}

export async function createRide(input: NewRideInput): Promise<string> {
  const [year, month, day] = input.date.split("-").map(Number);
  const [hours, minutes] = input.time.split(":").map(Number);
  const rideDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const rideTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

  const ref = await addDoc(collection(getDb(), "rides"), {
    riderId: input.riderId,
    riderName: input.riderName,
    departure: input.departure,
    departureAddress: input.departureAddress,
    destination: input.destination,
    destinationAddress: input.destinationAddress,
    date: Timestamp.fromDate(rideDate),
    time: Timestamp.fromDate(rideTime),
    availableSeats: input.availableSeats,
    totalSeats: input.availableSeats,
    bookedSeats: 0,
    price: input.price,
    isCancelled: false,
    note: input.note ?? null,
    createdAt: Timestamp.fromDate(new Date()),
    status: "scheduled" satisfies RideStatus,
  });
  return ref.id;
}

export async function cancelRide(rideId: string): Promise<void> {
  await updateDoc(doc(getDb(), "rides", rideId), { isCancelled: true });
}
