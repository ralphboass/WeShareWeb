"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CarFront,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { fetchRide } from "@/lib/rides";
import { fetchBookingsForRide } from "@/lib/bookings";
import { fetchProfile } from "@/lib/users";
import { formatRideDate, formatRideTime } from "@/lib/format";
import { formatMoney } from "@/lib/pricing";
import type { Booking, Ride, UserProfile } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { BookingDialog } from "./BookingDialog";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonLink,
  Panel,
  Spinner,
} from "./ui";

export function RideDetail({ rideId }: { rideId: string }) {
  const { firebaseUser, profile } = useAuth();
  const [ride, setRide] = useState<Ride | null | undefined>(undefined);
  const [driver, setDriver] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [justBooked, setJustBooked] = useState(false);

  const load = useCallback(async () => {
    const found = await fetchRide(rideId);
    setRide(found);
    if (!found) return;
    const [driverProfile, rideBookings] = await Promise.all([
      fetchProfile(found.riderId),
      fetchBookingsForRide(found.id),
    ]);
    setDriver(driverProfile);
    setBookings(rideBookings);
  }, [rideId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (ride === undefined) return <Spinner label="Loading ride…" />;

  if (ride === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <CarFront className="mx-auto size-10 text-neutral-300" />
        <h1 className="mt-4 text-2xl font-bold text-ink">Ride not found</h1>
        <p className="mt-2 text-ink-muted">
          This ride may have been removed by the driver.
        </p>
        <ButtonLink href="/rides" className="mt-6">
          Browse all rides
        </ButtonLink>
      </div>
    );
  }

  const isDriver = firebaseUser?.uid === ride.riderId;
  const myBooking = bookings.find(
    (booking) =>
      booking.passengerId === firebaseUser?.uid && booking.status !== "cancelled",
  );
  const activeBookings = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "completed",
  );
  const departed = ride.dateTime.getTime() < Date.now();
  const soldOut = ride.availableSeats <= 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <Link
        href="/rides"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
      >
        <ArrowLeft className="size-4" />
        Available rides
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-4">
          {ride.isCancelled && (
            <Alert tone="error">This ride was cancelled by the driver.</Alert>
          )}
          {!ride.isCancelled && departed && (
            <Alert tone="warning">
              This ride has already departed and can no longer be booked.
            </Alert>
          )}
          {justBooked && (
            <Alert tone="success">
              Seat requested. Your card is authorized but not charged — the
              driver has to accept first, and the payment is only captured after
              the ride.
            </Alert>
          )}
          {myBooking && !justBooked && (
            <Alert tone={myBooking.status === "confirmed" ? "success" : "info"}>
              {myBooking.status === "confirmed"
                ? `You have ${myBooking.seatsBooked} confirmed seat${myBooking.seatsBooked === 1 ? "" : "s"} on this ride.`
                : "Your request is waiting for the driver to accept."}{" "}
              <Link href="/bookings" className="font-semibold underline">
                View in My trips
              </Link>
            </Alert>
          )}

          <Panel className="p-5">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-red-500" />
              <div>
                <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                  From
                </p>
                <p className="text-lg font-bold text-ink">{ride.departure}</p>
                <p className="text-sm text-ink-muted">{ride.departureAddress}</p>
              </div>
            </div>

            <ArrowDown className="my-3 ml-1.5 size-5 text-brand-600" />

            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                  To
                </p>
                <p className="text-lg font-bold text-ink">{ride.destination}</p>
                <p className="text-sm text-ink-muted">
                  {ride.destinationAddress}
                </p>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(ride.departureAddress)}&destination=${encodeURIComponent(ride.destinationAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <MapPin className="size-4" />
              View route on map
            </a>
          </Panel>

          <div className="grid gap-4 sm:grid-cols-2">
            <Panel>
              <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                Date &amp; time
              </p>
              <div className="mt-3 flex items-center gap-5">
                <span>
                  <span className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <CalendarDays className="size-3.5 text-brand-600" />
                    Date
                  </span>
                  <span className="mt-0.5 block font-bold text-ink">
                    {formatRideDate(ride.date)}
                  </span>
                </span>
                <span className="h-8 w-px bg-neutral-300" />
                <span>
                  <span className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <Clock className="size-3.5 text-brand-600" />
                    Time
                  </span>
                  <span className="mt-0.5 block font-bold text-ink">
                    {formatRideTime(ride.time)}
                  </span>
                </span>
              </div>
            </Panel>

            <Panel>
              <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                Available seats
              </p>
              <p
                className={`mt-3 text-3xl font-extrabold ${soldOut ? "text-red-600" : "text-emerald-600"}`}
              >
                {ride.availableSeats}
              </p>
              <p className="text-sm text-ink-muted">
                {soldOut
                  ? "Fully booked"
                  : `of ${ride.totalSeats ?? ride.availableSeats} seats`}
              </p>
            </Panel>
          </div>

          {ride.note && (
            <Panel>
              <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                Note from the driver
              </p>
              <p className="mt-2 text-sm text-ink-soft">{ride.note}</p>
            </Panel>
          )}

          <Panel>
            <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
              Passengers ({activeBookings.length})
            </p>
            {activeBookings.length === 0 ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                <Users className="size-4" />
                No confirmed passengers yet
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {activeBookings.map((booking) => (
                  <li key={booking.id} className="flex items-center gap-3">
                    <Avatar name={booking.passengerName} size={32} />
                    <span className="text-sm font-medium text-ink">
                      {booking.passengerName}
                    </span>
                    <span className="ml-auto text-xs text-ink-muted">
                      {booking.seatsBooked} seat
                      {booking.seatsBooked === 1 ? "" : "s"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
              Price
            </p>
            <p className="mt-1 text-4xl font-extrabold text-brand-600">
              {formatMoney(ride.price)}
            </p>
            <p className="text-sm text-ink-muted">per seat</p>

            <div className="mt-5 border-t border-neutral-100 pt-4">
              <p className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                Driver
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar
                  name={driver ? `${driver.firstName} ${driver.lastName}` : ride.riderName}
                  imageUrl={driver?.profileImageUrl}
                  size={44}
                />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate font-bold text-ink">
                    {driver
                      ? `${driver.firstName} ${driver.lastName}`.trim()
                      : ride.riderName}
                    {driver?.uclaVerified && (
                      <BadgeCheck className="size-4 text-brand-600" />
                    )}
                  </p>
                  {driver?.driverRating ? (
                    <p className="flex items-center gap-1 text-sm text-ink-muted">
                      <Star className="size-3.5 fill-brand-500 text-brand-500" />
                      {driver.driverRating.toFixed(1)} (
                      {driver.driverReviewCount ?? 0})
                    </p>
                  ) : (
                    <p className="text-sm text-ink-muted">No ratings yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {isDriver ? (
                <>
                  <Badge tone="neutral">This is your ride</Badge>
                  <ButtonLink href="/bookings" className="w-full">
                    Manage seat requests
                  </ButtonLink>
                </>
              ) : (
                <>
                  <Button
                    className="w-full"
                    disabled={
                      soldOut || departed || Boolean(ride.isCancelled) || Boolean(myBooking)
                    }
                    onClick={() => setBookingOpen(true)}
                  >
                    {myBooking
                      ? "Already requested"
                      : soldOut
                        ? "Fully booked"
                        : departed
                          ? "Ride departed"
                          : "Book this ride"}
                  </Button>
                  {firebaseUser ? (
                    <ButtonLink
                      href={`/messages?to=${ride.riderId}`}
                      variant="secondary"
                      className="w-full"
                    >
                      <MessageCircle className="size-4" />
                      Message driver
                    </ButtonLink>
                  ) : (
                    <ButtonLink
                      href={`/login?next=/rides/${ride.id}`}
                      variant="secondary"
                      className="w-full"
                    >
                      Log in to message the driver
                    </ButtonLink>
                  )}
                </>
              )}
            </div>

            <p className="mt-4 text-xs text-ink-muted">
              Your card is authorized when you request a seat and only charged
              after the ride is completed.
            </p>
          </div>
        </aside>
      </div>

      {bookingOpen && (
        <BookingDialog
          ride={ride}
          passengerName={
            profile
              ? `${profile.firstName} ${profile.lastName}`.trim()
              : (firebaseUser?.displayName ?? "")
          }
          onClose={() => setBookingOpen(false)}
          onBooked={async () => {
            setBookingOpen(false);
            setJustBooked(true);
            await load();
          }}
        />
      )}
    </div>
  );
}

export function RideDetailFallback() {
  return (
    <div className="flex justify-center py-24 text-ink-muted">
      <Loader2 className="size-5 animate-spin" />
    </div>
  );
}
