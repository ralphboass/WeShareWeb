"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  CalendarDays,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createRide } from "@/lib/rides";
import { isFirebaseConfigured } from "@/lib/firebase";
import { driverEarnings, formatMoney, priceBreakdown } from "@/lib/pricing";
import {
  Alert,
  Button,
  ButtonLink,
  Card,
  Field,
  Panel,
  Spinner,
  inputClass,
} from "@/components/ui";

const todayInput = () => new Date().toISOString().slice(0, 10);

export default function NewRidePage() {
  const router = useRouter();
  const { firebaseUser, profile, loading } = useAuth();

  const [departure, setDeparture] = useState("");
  const [departureAddress, setDepartureAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [date, setDate] = useState(todayInput());
  const [time, setTime] = useState("08:00");
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState("10");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Spinner label="Loading…" />;

  if (!firebaseUser) {
    return (
      <div className="mx-auto max-w-md px-5 py-20">
        <Card>
          <h1 className="text-xl font-bold text-ink">Log in to offer a ride</h1>
          <p className="mt-2 text-sm text-ink-muted">
            You need an account so passengers can see who they are riding with.
          </p>
          <div className="mt-5 flex gap-3">
            <ButtonLink href="/login?next=/rides/new" className="flex-1">
              Log in
            </ButtonLink>
            <ButtonLink href="/signup" variant="secondary" className="flex-1">
              Sign up
            </ButtonLink>
          </div>
        </Card>
      </div>
    );
  }

  const seatPrice = Number(price) || 0;
  const perSeat = priceBreakdown({ pricePerSeat: seatPrice, seats: 1 });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFirebaseConfigured) return;

    if (!departure.trim() || !destination.trim()) {
      setError("Add both a pickup and a drop-off name.");
      return;
    }
    if (!departureAddress.trim() || !destinationAddress.trim()) {
      setError("Add the full addresses so passengers know where to meet you.");
      return;
    }
    if (seatPrice <= 0) {
      setError("Set a price per seat above $0.");
      return;
    }

    const departsAt = new Date(`${date}T${time}`);
    if (Number.isNaN(departsAt.getTime()) || departsAt.getTime() < Date.now()) {
      setError("Pick a departure date and time in the future.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const rideId = await createRide({
        riderId: firebaseUser.uid,
        riderName: profile
          ? `${profile.firstName} ${profile.lastName}`.trim()
          : (firebaseUser.displayName ?? "Driver"),
        departure: departure.trim(),
        departureAddress: departureAddress.trim(),
        destination: destination.trim(),
        destinationAddress: destinationAddress.trim(),
        date,
        time,
        availableSeats: seats,
        price: seatPrice,
        note: note.trim() || undefined,
      });
      router.push(`/rides/${rideId}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The ride could not be published.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Offer a ride
      </h1>
      <p className="mt-1 text-ink-muted">
        Fill the empty seats on a drive you&apos;re already making.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        {!isFirebaseConfigured && (
          <Alert tone="info">
            Publishing rides is unavailable in demo mode.
          </Alert>
        )}
        {error && <Alert tone="error">{error}</Alert>}

        <Card>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-ink-muted uppercase">
            <MapPin className="size-4 text-red-500" />
            Pickup
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Short name" hint="Shown in search results">
              <input
                className={inputClass}
                placeholder="UCLA"
                value={departure}
                onChange={(event) => setDeparture(event.target.value)}
                required
              />
            </Field>
            <Field label="Full address">
              <input
                className={inputClass}
                placeholder="Westwood Plaza, Los Angeles, CA"
                value={departureAddress}
                onChange={(event) => setDepartureAddress(event.target.value)}
                required
              />
            </Field>
          </div>

          <ArrowDown className="my-5 mx-auto size-5 text-brand-600" />

          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-ink-muted uppercase">
            <MapPin className="size-4 text-emerald-500" />
            Drop-off
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Short name">
              <input
                className={inputClass}
                placeholder="LAX"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                required
              />
            </Field>
            <Field label="Full address">
              <input
                className={inputClass}
                placeholder="World Way, Los Angeles, CA"
                value={destinationAddress}
                onChange={(event) => setDestinationAddress(event.target.value)}
                required
              />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-brand-600" />
                <input
                  type="date"
                  min={todayInput()}
                  className={`${inputClass} pl-11`}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>
            </Field>
            <Field label="Departure time">
              <div className="relative">
                <Clock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-brand-600" />
                <input
                  type="time"
                  className={`${inputClass} pl-11`}
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                />
              </div>
            </Field>
            <Field label="Seats available">
              <div className="relative">
                <Users className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-brand-600" />
                <select
                  className={`${inputClass} pl-11`}
                  value={seats}
                  onChange={(event) => setSeats(Number(event.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((value) => (
                    <option key={value} value={value}>
                      {value} seat{value === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
            <Field label="Price per seat" hint="Cover your fuel and tolls">
              <div className="relative">
                <DollarSign className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-brand-600" />
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  className={`${inputClass} pl-11`}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Note for passengers (optional)">
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                placeholder="Meeting point, luggage space, stops along the way…"
                maxLength={300}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Panel>
          <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
            What you and your passengers pay
          </p>
          <div className="mt-3 space-y-1 text-sm text-ink-soft">
            <div className="flex justify-between">
              <span>Passenger pays per seat</span>
              <span className="font-semibold text-ink">
                {formatMoney(perSeat.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>You receive per seat, after fees</span>
              <span className="font-semibold text-ink">
                {formatMoney(driverEarnings(perSeat.total))}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Passengers pay a 5% service fee on top of your seat price. Payouts
            are sent through Stripe after the ride is completed — set up payouts
            in the iOS app if you haven&apos;t yet.
          </p>
        </Panel>

        <div className="flex gap-3">
          <Button
            type="submit"
            loading={submitting}
            disabled={!isFirebaseConfigured}
          >
            Publish ride
          </Button>
          <ButtonLink href="/rides" variant="ghost">
            Cancel
          </ButtonLink>
        </div>
      </form>
    </div>
  );
}
