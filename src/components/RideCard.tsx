import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Users } from "lucide-react";
import { formatRideDate, formatRideTime } from "@/lib/format";
import { smartDeparture, smartDestination } from "@/lib/smart-location";
import { formatMoney } from "@/lib/pricing";
import type { Ride } from "@/lib/types";
import { Avatar, cx } from "./ui";

/**
 * Ride row styled after the app's RideRowView: route with arrow, blue price,
 * date/time metadata, driver and seat availability in green (or red when full).
 */
export function RideCard({ ride }: { ride: Ride }) {
  const seatsLeft = ride.availableSeats;
  const soldOut = seatsLeft <= 0;

  return (
    <Link
      href={`/rides/${ride.id}`}
      className="group block rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-base font-bold text-ink">
            <span className="truncate">{smartDeparture(ride)}</span>
            <ArrowRight className="size-4 shrink-0 text-brand-600 transition group-hover:translate-x-0.5" />
            <span className="truncate">{smartDestination(ride)}</span>
          </div>
          <p className="mt-1 truncate text-xs text-ink-muted">
            {ride.departureAddress} → {ride.destinationAddress}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-extrabold text-brand-600">
            {formatMoney(ride.price)}
          </p>
          <p className="text-xs text-ink-muted">per seat</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4 text-brand-600" />
          {formatRideDate(ride.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4 text-brand-600" />
          {formatRideTime(ride.time)}
        </span>
        <span
          className={cx(
            "inline-flex items-center gap-1.5 font-semibold",
            soldOut ? "text-red-600" : "text-emerald-600",
          )}
        >
          <Users className="size-4" />
          {soldOut
            ? "Fully booked"
            : `${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left`}
        </span>
        <span className="ml-auto inline-flex items-center gap-2">
          <Avatar name={ride.riderName} size={26} />
          <span className="text-sm font-medium text-ink">{ride.riderName}</span>
        </span>
      </div>
    </Link>
  );
}
