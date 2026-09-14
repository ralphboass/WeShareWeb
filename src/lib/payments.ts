import { httpsCallable } from "firebase/functions";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { getFns } from "./firebase";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export const isStripeConfigured = Boolean(publishableKey);

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!isStripeConfigured) return Promise.resolve(null);
  stripePromise ??= loadStripe(publishableKey);
  return stripePromise;
}

/**
 * Calls the existing `createPaymentIntent` Cloud Function with manual capture,
 * the same contract the iOS app uses (StripeService.createPaymentIntent).
 * The card is authorized now and captured after the ride completes.
 */
export async function createPaymentIntent(input: {
  amount: number;
  driverId: string;
  bookingId?: string;
}): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const callable = httpsCallable<
    Record<string, unknown>,
    { clientSecret: string; paymentIntentId: string }
  >(getFns(), "createPaymentIntent");

  const result = await callable({
    bookingId: input.bookingId ?? "",
    amount: input.amount,
    driverId: input.driverId,
    captureMethod: "manual",
  });

  if (!result.data?.clientSecret || !result.data?.paymentIntentId) {
    throw new Error("Payment could not be started. Please try again.");
  }
  return result.data;
}

/** Attaches the booking id to the intent once the booking document exists. */
export async function updatePaymentIntentMetadata(
  paymentIntentId: string,
  bookingId: string,
): Promise<void> {
  const callable = httpsCallable(getFns(), "updatePaymentIntentMetadata");
  await callable({ paymentIntentId, bookingId });
}

export async function cancelPaymentIntent(
  paymentIntentId: string,
): Promise<void> {
  const callable = httpsCallable(getFns(), "cancelPaymentIntent");
  await callable({ paymentIntentId });
}

export async function refundBooking(
  bookingId: string,
  reason = "requested_by_customer",
): Promise<void> {
  const callable = httpsCallable(getFns(), "processRefund");
  await callable({ bookingId, reason });
}
