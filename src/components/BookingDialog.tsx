"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import {
  CreditCard,
  Info,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createBooking } from "@/lib/bookings";
import { sendMessage } from "@/lib/chat";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  cancelPaymentIntent,
  createPaymentIntent,
  getStripe,
  isStripeConfigured,
  updatePaymentIntentMetadata,
} from "@/lib/payments";
import { formatRideDate, formatRideTime } from "@/lib/format";
import { formatMoney, priceBreakdown } from "@/lib/pricing";
import type { Ride } from "@/lib/types";
import { Alert, Button, ButtonLink, inputClass } from "./ui";

interface BookingDialogProps {
  ride: Ride;
  passengerName: string;
  onClose: () => void;
  onBooked: () => void | Promise<void>;
}

export function BookingDialog(props: BookingDialogProps) {
  const { ride, onClose } = props;
  const { firebaseUser, configured } = useAuth();

  const maxSeats = Math.min(ride.availableSeats, 4);
  const [seats, setSeats] = useState(1);
  const [note, setNote] = useState("");
  const [intent, setIntent] = useState<{
    clientSecret: string;
    paymentIntentId: string;
  } | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const breakdown = useMemo(
    () => priceBreakdown({ pricePerSeat: ride.price, seats }),
    [ride.price, seats],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const startPayment = async () => {
    setPreparing(true);
    setError(null);
    try {
      const created = await createPaymentIntent({
        amount: breakdown.total,
        driverId: ride.riderId,
      });
      setIntent(created);
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Payment could not be started.",
      );
    } finally {
      setPreparing(false);
    }
  };

  const elementsOptions: StripeElementsOptions | null = intent
    ? {
        clientSecret: intent.clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#2563eb",
            colorText: "#171717",
            borderRadius: "12px",
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          },
        },
      }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-ink">Book this ride</h2>
            <p className="text-sm text-ink-muted">
              {ride.departure} → {ride.destination} ·{" "}
              {formatRideDate(ride.date)} at {formatRideTime(ride.time)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-muted transition hover:bg-neutral-100"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {!configured || !isFirebaseConfigured ? (
            <Alert tone="info">
              Booking is unavailable in demo mode. Configure the Firebase
              environment variables to enable accounts and payments.
            </Alert>
          ) : !firebaseUser ? (
            <>
              <Alert tone="info">
                Log in or create an account to reserve a seat.
              </Alert>
              <div className="flex gap-3">
                <ButtonLink
                  href={`/login?next=/rides/${ride.id}`}
                  className="flex-1"
                >
                  Log in
                </ButtonLink>
                <ButtonLink
                  href="/signup"
                  variant="secondary"
                  className="flex-1"
                >
                  Sign up
                </ButtonLink>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                  Seats
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setSeats((value) => Math.max(1, value - 1))}
                    disabled={seats <= 1 || Boolean(intent)}
                    className="rounded-full p-1.5 text-brand-600 transition hover:bg-brand-50 disabled:opacity-40"
                    aria-label="Fewer seats"
                  >
                    <Minus className="size-5" />
                  </button>
                  <span className="w-8 text-center text-2xl font-extrabold text-ink">
                    {seats}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSeats((value) => Math.min(maxSeats, value + 1))
                    }
                    disabled={seats >= maxSeats || Boolean(intent)}
                    className="rounded-full p-1.5 text-brand-600 transition hover:bg-brand-50 disabled:opacity-40"
                    aria-label="More seats"
                  >
                    <Plus className="size-5" />
                  </button>
                  <span className="text-sm text-ink-muted">
                    {ride.availableSeats} available
                  </span>
                </div>
              </div>

              {!intent && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold tracking-wider text-ink-muted uppercase">
                    Message to the driver (optional)
                  </span>
                  <textarea
                    className={`${inputClass} min-h-20 resize-y`}
                    placeholder="Where exactly should we meet? Any luggage?"
                    value={note}
                    maxLength={300}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </label>
              )}

              <div className="rounded-xl bg-neutral-100 p-4 text-sm">
                <Row
                  label={`${formatMoney(ride.price)} × ${seats} seat${seats === 1 ? "" : "s"}`}
                  value={formatMoney(breakdown.subtotal)}
                />
                <Row
                  label="Service fee (5%)"
                  value={formatMoney(breakdown.serviceFee)}
                />
                <div className="mt-3 flex items-center justify-between border-t border-neutral-300 pt-3 text-base font-extrabold text-ink">
                  <span>Total</span>
                  <span>{formatMoney(breakdown.total)}</span>
                </div>
              </div>

              <div className="flex gap-2 rounded-xl bg-brand-50 p-3 text-xs text-brand-800">
                <Info className="mt-0.5 size-4 shrink-0" />
                <p>
                  We authorize {formatMoney(breakdown.total)} on your card now.
                  The driver still has to accept, and the amount is only charged
                  after the ride is completed. Free cancellation up to 2 hours
                  before departure.
                </p>
              </div>

              {error && <Alert tone="error">{error}</Alert>}

              {!intent ? (
                <>
                  {!isStripeConfigured && (
                    <Alert tone="warning">
                      Card payments are not configured on this deployment yet
                      (missing Stripe publishable key).
                    </Alert>
                  )}
                  <Button
                    className="w-full"
                    loading={preparing}
                    disabled={!isStripeConfigured}
                    onClick={startPayment}
                  >
                    <CreditCard className="size-4" />
                    Continue to payment
                  </Button>
                </>
              ) : (
                <StripeCheckout
                  {...props}
                  seats={seats}
                  note={note}
                  amount={breakdown.total}
                  intent={intent}
                  elementsOptions={elementsOptions!}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-ink-soft">
      <span>{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}

function StripeCheckout({
  ride,
  passengerName,
  onBooked,
  seats,
  note,
  amount,
  intent,
  elementsOptions,
}: BookingDialogProps & {
  seats: number;
  note: string;
  amount: number;
  intent: { clientSecret: string; paymentIntentId: string };
  elementsOptions: StripeElementsOptions;
}) {
  return (
    <Elements stripe={getStripe()} options={elementsOptions}>
      <PaymentForm
        ride={ride}
        passengerName={passengerName}
        seats={seats}
        note={note}
        amount={amount}
        paymentIntentId={intent.paymentIntentId}
        onBooked={onBooked}
      />
    </Elements>
  );
}

function PaymentForm({
  ride,
  passengerName,
  seats,
  note,
  amount,
  paymentIntentId,
  onBooked,
}: {
  ride: Ride;
  passengerName: string;
  seats: number;
  note: string;
  amount: number;
  paymentIntentId: string;
  onBooked: () => void | Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { firebaseUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !firebaseUser) return;

    setSubmitting(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/bookings` },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Your card could not be authorized.");
      setSubmitting(false);
      return;
    }

    // Manual capture leaves the intent in `requires_capture` once authorized.
    const authorized =
      paymentIntent?.status === "requires_capture" ||
      paymentIntent?.status === "succeeded";

    if (!authorized) {
      setError("The payment was not completed. Please try another card.");
      setSubmitting(false);
      return;
    }

    try {
      const bookingId = await createBooking({
        ride,
        passengerId: firebaseUser.uid,
        passengerName: passengerName || (firebaseUser.email ?? "Passenger"),
        seatsBooked: seats,
        note: note.trim() || undefined,
        paymentIntentId,
        amountPaidByPassenger: amount,
      });

      await updatePaymentIntentMetadata(paymentIntentId, bookingId);

      const intro = `Hi! I requested ${seats} seat${seats === 1 ? "" : "s"} on your ride ${ride.departure} → ${ride.destination}.`;
      await sendMessage({
        content: note.trim() ? `${intro}\n\n${note.trim()}` : intro,
        senderId: firebaseUser.uid,
        receiverId: ride.riderId,
        rideId: ride.id,
      });

      await onBooked();
    } catch (bookingError) {
      // The card was authorized but the booking failed — release the hold.
      await cancelPaymentIntent(paymentIntentId).catch(() => {});
      setError(
        bookingError instanceof Error
          ? `${bookingError.message} Your card authorization was released.`
          : "The booking could not be created. Your card authorization was released.",
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <PaymentElement />
      {error && <Alert tone="error">{error}</Alert>}
      <Button type="submit" className="w-full" loading={submitting}>
        <Lock className="size-4" />
        Authorize {formatMoney(amount)}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
        <ShieldCheck className="size-3.5" />
        Card details are handled by Stripe and never reach WeShare servers.
      </p>
    </form>
  );
}
