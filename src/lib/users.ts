import {
  Timestamp,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import type { UserProfile } from "./types";

const toDate = (value: unknown): Date =>
  value instanceof Timestamp ? value.toDate() : new Date();

export function profileFromData(
  id: string,
  data: Record<string, unknown>,
): UserProfile {
  const first = (data.firstName as string) ?? "";
  const last = (data.lastName as string) ?? "";
  const legacy = ((data.fullName as string) ?? "").split(" ");

  return {
    id,
    email: (data.email as string) ?? "",
    firstName: first || legacy[0] || "",
    lastName: last || legacy.slice(1).join(" "),
    phoneNumber: (data.phoneNumber as string) ?? "",
    profileImageUrl: (data.profileImageUrl as string) ?? undefined,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    numberOfTrips: Number(data.numberOfTrips ?? 0),
    address: (data.address as string) ?? undefined,
    cars: (data.cars as UserProfile["cars"]) ?? undefined,
    emailVerified: (data.emailVerified as boolean) ?? undefined,
    walletBalance: Number(data.walletBalance ?? 0),
    driverRating:
      data.driverRating != null ? Number(data.driverRating) : undefined,
    driverReviewCount:
      data.driverReviewCount != null ? Number(data.driverReviewCount) : undefined,
    passengerRating:
      data.passengerRating != null ? Number(data.passengerRating) : undefined,
    passengerReviewCount:
      data.passengerReviewCount != null
        ? Number(data.passengerReviewCount)
        : undefined,
    uclaVerified: (data.uclaVerified as boolean) ?? undefined,
    biography: (data.biography as string) ?? undefined,
    stripeConnectAccountId: (data.stripeConnectAccountId as string) ?? undefined,
  };
}

export function subscribeToProfile(
  userId: string,
  onProfile: (profile: UserProfile | null) => void,
): () => void {
  if (!isFirebaseConfigured) {
    onProfile(null);
    return () => {};
  }
  return onSnapshot(doc(getDb(), "users", userId), (snapshot) =>
    onProfile(
      snapshot.exists()
        ? profileFromData(snapshot.id, snapshot.data() as Record<string, unknown>)
        : null,
    ),
  );
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured) return null;
  const snapshot = await getDoc(doc(getDb(), "users", userId));
  return snapshot.exists()
    ? profileFromData(snapshot.id, snapshot.data() as Record<string, unknown>)
    : null;
}

/** Same document shape the iOS app writes at sign-up (User.dictionary). */
export async function createProfileDocument(input: {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  uclaVerified: boolean;
}): Promise<void> {
  const now = Timestamp.fromDate(new Date());
  await setDoc(doc(getDb(), "users", input.userId), {
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phoneNumber: input.phoneNumber,
    numberOfTrips: 0,
    walletBalance: 0,
    createdAt: now,
    updatedAt: now,
    emailVerified: false,
    uclaVerified: input.uclaVerified,
  });
}

export async function updateProfile(
  userId: string,
  changes: Partial<
    Pick<
      UserProfile,
      "firstName" | "lastName" | "phoneNumber" | "address" | "biography"
    >
  >,
): Promise<void> {
  await updateDoc(doc(getDb(), "users", userId), {
    ...changes,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

/** Universities recognised by the app for verified-student status. */
const CAMPUS_DOMAINS: Record<string, string> = {
  "ucla.edu": "UCLA",
  "usc.edu": "USC",
  "ucsb.edu": "UCSB",
  "ucsd.edu": "UCSD",
  "uci.edu": "UCI",
  "ucr.edu": "UCR",
  "csun.edu": "CSUN",
  "caltech.edu": "Caltech",
  "smc.edu": "Santa Monica College",
  "lmu.edu": "Loyola Marymount University",
  "pepperdine.edu": "Pepperdine University",
  "csulb.edu": "Cal State Long Beach",
  "fullerton.edu": "Cal State Fullerton",
  "chapman.edu": "Chapman University",
  "pasadena.edu": "Pasadena City College",
};

export function campusFromEmail(email: string): string | null {
  const lower = email.toLowerCase();
  const match = Object.keys(CAMPUS_DOMAINS).find((domain) =>
    lower.endsWith(`@${domain}`),
  );
  return match ? CAMPUS_DOMAINS[match] : null;
}

export const isStudentEmail = (email: string) =>
  email.toLowerCase().trim().endsWith(".edu");
