"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronDown,
  Clock,
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
import { cancelRide, combineDateTime, fetchRidesByDriver } from "@/lib/rides";
import { formatRideDate, formatRideTime } from "@/lib/format";
import { formatMoney } from "@/lib/pricing";
import { smartDeparture, smartDestination } from "@/lib/smart-location";
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

type Tab = "bookings" | "rides";
type Segment = "upcoming" | "past" | "cancelled";

/** Rides with passengers stay "upcoming" for 6h after departure, as in the app. */
const RUNNING_WINDOW_MS = 6 * 60 * 60 * 1000;

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

const bookingDateTime = (booking: Booking) =>
  combineDateTime(booking.rideDate, booking.rideTime);

export default function TripsPage() {
  const { firebaseUser, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("bookings");
  const [segment, setSegment] = useState<Segment>("upcoming");
  const [myBookings, setMyBookings] = useState<Booking[] | null>(null);
  const [driverBookings, setDriverBookings] = useState<Booking[] | null>(null);
  const [myRides, setMyRides] = useState<Ride[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<
    { tone: "success" | "error"; text: string } | null
  >(null);

  const userId = firebaseUser?.uid;

  useEffect(() => {
    if (!userId) return;
    return subscribeToPassengerBookings(userId, setMyBookings);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    return subscribeToDriverBookings(userId, setDriverBookings);
  }, [userId]);

  const reloadRides = async (driverId: string) =>
    setMyRides(await fetchRidesByDriver(driverId));

  useEffect(() => {
    if (!userId) return;
    void reloadRides(userId);
  }, [userId]);

  /** Pending seat requests keyed by ride, so each ride card can show its own. */
  const requestsByRide = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const booking of driverBookings ?? []) {
      if (booking.status !== "pending") continue;
      map.set(booking.rideId, [...(map.get(booking.rideId) ?? []), booking]);
    }
    return map;
  }, [driverBookings]);

  const seatedRideIds = useMemo(() => {
    const ids = new Set<string>();
    for (const booking of driverBookings ?? []) {
      if (booking.status === "cancelled") continue;
      ids.add(booking.rideId);
    }
    return ids;
  }, [driverBookings]);

  const bookingGroups = useMemo(() => {
    const now = Date.now();
    const all = myBookings ?? [];
    return {
      upcoming: all
        .filter((booking) => bookingDateTime(booking).getTime() > now)
        .sort(
          (a, b) => bookingDateTime(a).getTime() - bookingDateTime(b).getTime(),
        ),
      past: all
        .filter((booking) => bookingDateTime(booking).getTime() <= now)
        .sort(
          (a, b) => bookingDateTime(b).getTime() - bookingDateTime(a).getTime(),
        ),
      cancelled: [] as Booking[],
    };
  }, [myBookings]);

  // Mirrors MyRidesView: future rides are upcoming; departed rides stay
  // upcoming only while passengers are on board (6h), otherwise they are past.
  const rideGroups = useMemo(() => {
    const now = Date.now();
    const all = myRides ?? [];
    const isRunning = (ride: Ride) =>
      seatedRideIds.has(ride.id) &&
      now < ride.dateTime.getTime() + RUNNING_WINDOW_MS;

    return {
      upcoming: all
        .filter(
          (ride) =>
            !ride.isCancelled &&
            ride.status !== "completed" &&
            (ride.dateTime.getTime() > now || isRunning(ride)),
        )
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
      past: all
        .filter(
          (ride) =>
            !ride.isCancelled &&
            (ride.status === "completed" ||
              (ride.dateTime.getTime() <= now && !isRunning(ride))),
        )
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime()),
      cancelled: all
        .filter((ride) => ride.isCancelled)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime()),
    };
  }, [myRides, seatedRideIds]);

  if (loading) return <Spinner label="Loading your trips…" />;

  if (!firebaseUser || !userId) {
    return (
      <div className="mx-auto max-w-md px-5 py-20">
        <Card>
          <h1 className="text-xl font-bold text-ink">Log in to see your trips</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Your bookings and the rides you offer live here.
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
    setNotice(null);
    try {
      await action();
      await reloadRides(userId);
      setNotice({ tone: "success", text: successText });
    } catch (actionError) {
      setNotice({
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

  const pendingCount = [...requestsByRide.values()].reduce(
    (total, list) => total + list.length,
    0,
  );

  const activeGroups = tab === "bookings" ? bookingGroups : rideGroups;
  const segments: Segment[] =
    tab === "bookings" ? ["upcoming", "past"] : ["upcoming", "past", "cancelled"];
  const currentSegment = segments.includes(segment) ? segment : "upcoming";

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        My trips
      </h1>
      <p className="mt-1 text-ink-muted">
        Seats you booked and the rides you offer.
      </p>

      <div className="mt-6 flex gap-1 border-b border-neutral-200">
        {(
          [
            { key: "bookings", label: "My bookings", count: myBookings?.length },
            { key: "rides", label: "My rides", count: pendingCount || undefined },
          ] as const
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setTab(item.key);
              setSegment("upcoming");
            }}
            className={cx(
              "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition",
              tab === item.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {item.label}
            {item.count ? (
              <span
                className={cx(
                  "ml-2 rounded-full px-2 py-0.5 text-xs",
                  item.key === "rides" && pendingCount
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-brand-100 text-brand-700",
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-neutral-100 p-1">
          {segments.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSegment(key)}
              className={cx(
                "rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition",
                currentSegment === key
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {key}
              <span className="ml-1.5 text-xs font-medium text-ink-muted">
                {activeGroups[key].length}
              </span>
            </button>
          ))}
        </div>

        {tab === "rides" && (
          <ButtonLink href="/rides/new" className="px-4 py-2">
            Offer a ride
          </ButtonLink>
        )}
      </div>

      {notice && (
        <div className="mt-5">
          <Alert tone={notice.tone}>{notice.text}</Alert>
        </div>
      )}

      {/* Capped height with internal scrolling so long histories don't turn
          the page into an endless column. */}
      <div className="mt-5 max-h-[34rem] space-y-3 overflow-y-auto pr-1">
        {tab === "bookings" ? (
          myBookings === null ? (
            <Spinner />
          ) : bookingGroups[currentSegment].length === 0 ? (
            <EmptyState
              icon={<Ticket className="size-10" />}
              title={
                currentSegment === "upcoming"
                  ? "No upcoming bookings"
                  : "No past bookings"
              }
              description={
                currentSegment === "upcoming"
                  ? "Find a ride heading your way and reserve a seat."
                  : "Rides you have taken will be listed here."
              }
              action={
                currentSegment === "upcoming" ? (
                  <ButtonLink href="/rides">Find a ride</ButtonLink>
                ) : undefined
              }
            />
          ) : (
            bookingGroups[currentSegment].map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                busy={busyId === booking.id}
                onCancel={() =>
                  runAction(
                    booking.id,
                    () => cancelBooking(booking, bookingDateTime(booking)),
                    "Booking cancelled and your card authorization released.",
                  )
                }
              />
            ))
          )
        ) : myRides === null ? (
          <Spinner />
        ) : rideGroups[currentSegment].length === 0 ? (
          <EmptyState
            icon={<CarFront className="size-10" />}
            title={
              currentSegment === "upcoming"
                ? "No upcoming rides"
                : currentSegment === "past"
                  ? "No past rides"
                  : "No cancelled rides"
            }
            description={
              currentSegment === "upcoming"
                ? "Post your route and fill the empty seats on a drive you are already making."
                : undefined
            }
            action={
              currentSegment === "upcoming" ? (
                <ButtonLink href="/rides/new">Offer a ride</ButtonLink>
              ) : undefined
            }
          />
        ) : (
          rideGroups[currentSegment].map((ride) => (
            <RideRow
              key={ride.id}
              ride={ride}
              requests={requestsByRide.get(ride.id) ?? []}
              confirmed={(driverBookings ?? []).filter(
                (booking) =>
                  booking.rideId === ride.id &&
                  (booking.status === "confirmed" ||
                    booking.status === "completed"),
              )}
              busyId={busyId}
              onAccept={(booking) =>
                runAction(
                  booking.id,
                  () => confirmBooking(booking),
                  "Request accepted. The seat is now reserved.",
                )
              }
              onDecline={(booking) =>
                runAction(
                  booking.id,
                  () => declineBooking(booking),
                  "Request declined and the passenger's card released.",
                )
              }
              onCancelRide={() =>
                runAction(
                  ride.id,
                  () => cancelRide(ride.id),
                  "Ride cancelled. Passengers can no longer book it.",
                )
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function RouteLine({ from, to }: { from: string; to: string }) {
  return (
    <p className="flex items-center gap-2 font-bold text-ink">
      <span className="truncate">{from}</span>
      <ArrowRight className="size-4 shrink-0 text-brand-600" />
      <span className="truncate">{to}</span>
    </p>
  );
}

function MetaLine({
  date,
  time,
  trailing,
}: {
  date: Date;
  time: Date;
  trailing?: React.ReactNode;
}) {
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-3.5" />
        {formatRideDate(date)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5" />
        {formatRideTime(time)}
      </span>
      {trailing}
    </p>
  );
}

function BookingRow({
  booking,
  busy,
  onCancel,
}: {
  booking: Booking;
  busy: boolean;
  onCancel: () => void;
}) {
  const departsAt = bookingDateTime(booking);
  const cancellable =
    departsAt.getTime() > Date.now() &&
    (booking.status === "pending" || booking.status === "confirmed");

  return (
    <Panel className="bg-white ring-1 ring-neutral-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <RouteLine from={booking.departure} to={booking.destination} />
          <MetaLine
            date={booking.rideDate}
            time={booking.rideTime}
            trailing={
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" />
                {booking.seatsBooked} seat
                {booking.seatsBooked === 1 ? "" : "s"}
              </span>
            }
          />
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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-auto inline-flex items-center gap-2 text-sm text-ink-soft">
          <Avatar name={booking.driverName} size={26} />
          {booking.driverName}
        </span>

        <ButtonLink
          href={`/messages?to=${booking.driverId}`}
          variant="ghost"
          className="px-3 py-2"
        >
          <MessageCircle className="size-4" />
          Message
        </ButtonLink>

        <ButtonLink
          href={`/rides/${booking.rideId}`}
          variant="secondary"
          className="px-3 py-2"
        >
          View ride
        </ButtonLink>

        {cancellable && (
          <Button
            variant="danger"
            className="px-3 py-2"
            loading={busy}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </Panel>
  );
}

function RideRow({
  ride,
  requests,
  confirmed,
  busyId,
  onAccept,
  onDecline,
  onCancelRide,
}: {
  ride: Ride;
  requests: Booking[];
  confirmed: Booking[];
  busyId: string | null;
  onAccept: (booking: Booking) => void;
  onDecline: (booking: Booking) => void;
  onCancelRide: () => void;
}) {
  const [open, setOpen] = useState(requests.length > 0);
  const departed = ride.dateTime.getTime() < Date.now();

  return (
    <Panel className="bg-white ring-1 ring-neutral-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <RouteLine from={smartDeparture(ride)} to={smartDestination(ride)} />
          <MetaLine
            date={ride.date}
            time={ride.time}
            trailing={
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" />
                {ride.availableSeats} of {ride.totalSeats ?? ride.availableSeats}{" "}
                free
              </span>
            }
          />
        </div>

        <div className="text-right">
          {ride.isCancelled ? (
            <Badge tone="red">Cancelled</Badge>
          ) : ride.status === "completed" ? (
            <Badge tone="brand">Completed</Badge>
          ) : departed ? (
            <Badge tone="neutral">In progress</Badge>
          ) : (
            <Badge tone="green">Live</Badge>
          )}
          <p className="mt-1.5 font-bold text-brand-600">
            {formatMoney(ride.price)}
          </p>
          <p className="text-xs text-ink-muted">per seat</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {requests.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="mr-auto inline-flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800 transition hover:bg-yellow-100"
          >
            {requests.length} seat request{requests.length === 1 ? "" : "s"}
            <ChevronDown
              className={cx("size-4 transition", open && "rotate-180")}
            />
          </button>
        )}

        {confirmed.length > 0 && (
          <span
            className={cx(
              "inline-flex items-center gap-1.5 text-sm text-ink-soft",
              requests.length === 0 && "mr-auto",
            )}
          >
            <CheckCircle2 className="size-4 text-emerald-600" />
            {confirmed.length} passenger{confirmed.length === 1 ? "" : "s"}
          </span>
        )}

        <ButtonLink
          href={`/rides/${ride.id}`}
          variant="secondary"
          className="px-3 py-2"
        >
          View ride
        </ButtonLink>

        {!ride.isCancelled && !departed && (
          <Button
            variant="danger"
            className="px-3 py-2"
            loading={busyId === ride.id}
            onClick={onCancelRide}
          >
            Cancel ride
          </Button>
        )}
      </div>

      {open && requests.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
          {requests.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-wrap items-center gap-3 rounded-lg bg-neutral-50 px-3 py-2.5"
            >
              <Avatar name={booking.passengerName} size={30} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">
                  {booking.passengerName}
                </span>
                <span className="block text-xs text-ink-muted">
                  {booking.seatsBooked} seat
                  {booking.seatsBooked === 1 ? "" : "s"} ·{" "}
                  {formatMoney(booking.amountPaid)} authorized
                </span>
              </span>

              <span className="ml-auto flex gap-2">
                <Link
                  href={`/messages?to=${booking.passengerId}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-ink-soft transition hover:bg-neutral-100"
                >
                  <MessageCircle className="size-4" />
                </Link>
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  loading={busyId === booking.id}
                  onClick={() => onDecline(booking)}
                >
                  <XCircle className="size-4" />
                  Decline
                </Button>
                <Button
                  variant="success"
                  className="px-3 py-2"
                  loading={busyId === booking.id}
                  onClick={() => onAccept(booking)}
                >
                  <CheckCircle2 className="size-4" />
                  Accept
                </Button>
              </span>

              {booking.note && (
                <p className="w-full rounded-lg bg-white px-3 py-2 text-sm text-ink-soft">
                  “{booking.note}”
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
