"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock,
  Inbox,
  MessageCircle,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  cancelBooking,
  confirmBooking,
  declineBooking,
  subscribeToDriverBookings,
  subscribeToPassengerBookings,
} from "@/lib/bookings";
import { combineDateTime, fetchRidesByDriver } from "@/lib/rides";
import { formatRideDate, formatRideTime } from "@/lib/format";
import { formatMoney } from "@/lib/pricing";
import type { Booking, BookingStatus, Ride } from "@/lib/types";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Panel,
  Spinner,
  cx,
} from "@/components/ui";

type Tab = "trips" | "requests" | "rides";

const statusTone: Record<
  BookingStatus,
  "brand" | "green" | "red" | "neutral" | "yellow"
> = {
  pending: "yellow",
  payment_required: "yellow",
  confirmed: "green",
  completed: "brand",
  cancelled: "red",
};

const statusLabel: Record<BookingStatus, string> = {
  pending: "Awaiting driver",
  payment_required: "Payment required",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingsPage() {
  const { firebaseUser, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("trips");
  const [myBookings, setMyBookings] = useState<Booking[] | null>(null);
  const [requests, setRequests] = useState<Booking[] | null>(null);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<
    { tone: "success" | "error"; text: string } | null
  >(null);

  const userId = firebaseUser?.uid;

  useEffect(() => {
    if (!userId) return;
    return subscribeToPassengerBookings(userId, setMyBookings);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    return subscribeToDriverBookings(userId, setRequests);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    void fetchRidesByDriver(userId).then(setMyRides);
  }, [userId]);

  const pendingRequests = useMemo(
    () => (requests ?? []).filter((booking) => booking.status === "pending"),
    [requests],
  );

  if (loading) return <Spinner label="Loading your trips…" />;

  if (!firebaseUser) {
    return (
      <div className="mx-auto max-w-md px-5 py-20">
        <Card>
          <h1 className="text-xl font-bold text-ink">Log in to see your trips</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Your bookings, seat requests and published rides live here.
          </p>
          <ButtonLink href="/login?next=/bookings" className="mt-5 w-full">
            Log in
          </ButtonLink>
        </Card>
      </div>
    );
  }

  const runAction = async (
    id: string,
    action: () => Promise<void>,
    successText: string,
  ) => {
    setBusyId(id);
    setMessage(null);
    try {
      await action();
      setMessage({ tone: "success", text: successText });
    } catch (actionError) {
      setMessage({
        tone: "error",
        text:
          actionError instanceof Error
            ? actionError.message
            : "That didn't work. Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const tabs: Array<{ key: Tab; label: string; count?: number }> = [
    { key: "trips", label: "My bookings", count: myBookings?.length },
    { key: "requests", label: "Seat requests", count: pendingRequests.length },
    { key: "rides", label: "My rides", count: myRides.length },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        My trips
      </h1>
      <p className="mt-1 text-ink-muted">
        Seats you booked, requests from passengers, and the rides you offer.
      </p>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-neutral-200">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cx(
              "-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition",
              tab === item.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {item.label}
            {item.count ? (
              <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
                {item.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {message && (
        <div className="mt-5">
          <Alert tone={message.tone}>{message.text}</Alert>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {tab === "trips" &&
          (myBookings === null ? (
            <Spinner />
          ) : myBookings.length === 0 ? (
            <EmptyState
              icon={<Ticket className="size-10" />}
              title="No bookings yet"
              description="Find a ride heading your way and reserve a seat."
              action={<ButtonLink href="/rides">Find a ride</ButtonLink>}
            />
          ) : (
            myBookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                perspective="passenger"
                busy={busyId === booking.id}
                onCancel={() =>
                  runAction(
                    booking.id,
                    () =>
                      cancelBooking(
                        booking,
                        combineDateTime(booking.rideDate, booking.rideTime),
                      ),
                    "Booking cancelled and your card authorization released.",
                  )
                }
              />
            ))
          ))}

        {tab === "requests" &&
          (requests === null ? (
            <Spinner />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<Inbox className="size-10" />}
              title="No seat requests"
              description="When someone requests a seat on one of your rides, it shows up here."
              action={<ButtonLink href="/rides/new">Offer a ride</ButtonLink>}
            />
          ) : (
            requests.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                perspective="driver"
                busy={busyId === booking.id}
                onAccept={() =>
                  runAction(
                    booking.id,
                    () => confirmBooking(booking),
                    "Request accepted. The seat is now reserved.",
                  )
                }
                onDecline={() =>
                  runAction(
                    booking.id,
                    () => declineBooking(booking),
                    "Request declined and the passenger's card released.",
                  )
                }
              />
            ))
          ))}

        {tab === "rides" &&
          (myRides.length === 0 ? (
            <EmptyState
              icon={<CarFront className="size-10" />}
              title="You haven't published a ride"
              description="Post your route and fill the empty seats on a drive you're already making."
              action={<ButtonLink href="/rides/new">Offer a ride</ButtonLink>}
            />
          ) : (
            myRides.map((ride) => (
              <Link
                key={ride.id}
                href={`/rides/${ride.id}`}
                className="block rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-brand-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-bold text-ink">
                      <span className="truncate">{ride.departure}</span>
                      <ArrowRight className="size-4 shrink-0 text-brand-600" />
                      <span className="truncate">{ride.destination}</span>
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" />
                        {formatRideDate(ride.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {formatRideTime(ride.time)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        {ride.availableSeats} of {ride.totalSeats ?? ride.availableSeats} free
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-brand-600">
                      {formatMoney(ride.price)}
                    </p>
                    {ride.isCancelled ? (
                      <Badge tone="red">Cancelled</Badge>
                    ) : ride.dateTime.getTime() < Date.now() ? (
                      <Badge tone="neutral">Past</Badge>
                    ) : (
                      <Badge tone="green">Live</Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ))}
      </div>
    </div>
  );
}

function BookingRow({
  booking,
  perspective,
  busy,
  onAccept,
  onDecline,
  onCancel,
}: {
  booking: Booking;
  perspective: "passenger" | "driver";
  busy: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}) {
  const partnerId =
    perspective === "passenger" ? booking.driverId : booking.passengerId;
  const partnerName =
    perspective === "passenger" ? booking.driverName : booking.passengerName;
  const departsAt = combineDateTime(booking.rideDate, booking.rideTime);
  const past = departsAt.getTime() < Date.now();
  const cancellable =
    !past &&
    (booking.status === "pending" || booking.status === "confirmed") &&
    perspective === "passenger";

  return (
    <Panel className="bg-white ring-1 ring-neutral-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-bold text-ink">
            <span className="truncate">{booking.departure}</span>
            <ArrowRight className="size-4 shrink-0 text-brand-600" />
            <span className="truncate">{booking.destination}</span>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {formatRideDate(booking.rideDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatRideTime(booking.rideTime)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" />
              {booking.seatsBooked} seat{booking.seatsBooked === 1 ? "" : "s"}
            </span>
          </p>
        </div>

        <div className="text-right">
          <Badge tone={statusTone[booking.status]}>
            {statusLabel[booking.status]}
          </Badge>
          <p className="mt-1.5 font-bold text-ink">
            {formatMoney(booking.amountPaid)}
          </p>
          <p className="text-xs text-ink-muted">
            {booking.paymentStatus === "succeeded"
              ? "charged"
              : booking.paymentStatus === "refunded"
                ? "released"
                : "authorized"}
          </p>
        </div>
      </div>

      {booking.note && (
        <p className="mt-3 rounded-lg bg-neutral-100 px-3 py-2 text-sm text-ink-soft">
          “{booking.note}”
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-auto inline-flex items-center gap-2 text-sm text-ink-soft">
          <Avatar name={partnerName} size={26} />
          {partnerName}
        </span>

        <ButtonLink
          href={`/messages?to=${partnerId}`}
          variant="ghost"
          className="px-3 py-2"
        >
          <MessageCircle className="size-4" />
          Message
        </ButtonLink>

        {perspective === "driver" && booking.status === "pending" && (
          <>
            <Button
              variant="secondary"
              className="px-3 py-2"
              loading={busy}
              onClick={onDecline}
            >
              <XCircle className="size-4" />
              Decline
            </Button>
            <Button
              variant="success"
              className="px-3 py-2"
              loading={busy}
              onClick={onAccept}
            >
              <CheckCircle2 className="size-4" />
              Accept
            </Button>
          </>
        )}

        {cancellable && (
          <Button
            variant="danger"
            className="px-3 py-2"
            loading={busy}
            onClick={onCancel}
          >
            Cancel booking
          </Button>
        )}
      </div>
    </Panel>
  );
}
