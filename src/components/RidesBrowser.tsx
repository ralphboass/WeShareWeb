"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CarFront, SlidersHorizontal } from "lucide-react";
import { filterRides, subscribeToRides } from "@/lib/rides";
import { formatDayHeading } from "@/lib/format";
import type { Ride } from "@/lib/types";
import { RideCard } from "./RideCard";
import { RideSearchForm } from "./RideSearchForm";
import { Alert, ButtonLink, EmptyState, Spinner, cx } from "./ui";

type SortKey = "departure" | "price" | "seats";

const sorters: Record<SortKey, (a: Ride, b: Ride) => number> = {
  departure: (a, b) => a.dateTime.getTime() - b.dateTime.getTime(),
  price: (a, b) => a.price - b.price,
  seats: (a, b) => b.availableSeats - a.availableSeats,
};

const sortLabels: Record<SortKey, string> = {
  departure: "Departure time",
  price: "Lowest price",
  seats: "Most seats",
};

export function RidesBrowser() {
  const router = useRouter();
  const params = useSearchParams();
  const [rides, setRides] = useState<Ride[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("departure");

  useEffect(
    () =>
      subscribeToRides(
        (next) => {
          setRides(next);
          setError(null);
        },
        (subscribeError) => {
          setRides([]);
          setError(subscribeError.message);
        },
      ),
    [],
  );

  const filters = useMemo(
    () => ({
      from: params.get("from") ?? "",
      to: params.get("to") ?? "",
      date: params.get("date") ?? "",
      seats: Number(params.get("seats") ?? 1),
    }),
    [params],
  );

  const results = useMemo(() => {
    if (!rides) return [];
    return filterRides(rides, filters).sort(sorters[sort]);
  }, [rides, filters, sort]);

  /** Grouped by departure day, like the app's sectioned ride list. */
  const groups = useMemo(() => {
    const byDay = new Map<string, Ride[]>();
    for (const ride of results) {
      const key = ride.date.toDateString();
      byDay.set(key, [...(byDay.get(key) ?? []), ride]);
    }
    return [...byDay.values()];
  }, [results]);

  const hasFilters = Boolean(
    filters.from || filters.to || filters.date || filters.seats > 1,
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Find a ride
      </h1>
      <p className="mt-1 text-ink-muted">
        Every upcoming seat shared by the WeShare community.
      </p>

      <div className="mt-6">
        <RideSearchForm
          variant="inline"
          initial={{
            from: filters.from,
            to: filters.to,
            date: filters.date,
            seats: filters.seats,
          }}
        />
      </div>

      {error && (
        <div className="mt-6">
          <Alert tone="error">
            Rides could not be loaded: {error}. Check your Firestore rules and
            connection, then reload.
          </Alert>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-soft">
          {rides === null
            ? "Searching…"
            : `${results.length} ride${results.length === 1 ? "" : "s"} found`}
          {hasFilters && (
            <button
              type="button"
              onClick={() => router.push("/rides")}
              className="ml-3 text-sm font-semibold text-brand-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <SlidersHorizontal className="size-4 text-ink-muted" />
          {(Object.keys(sortLabels) as SortKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={cx(
                "rounded-lg px-3 py-1.5 font-medium transition",
                sort === key
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-muted hover:bg-neutral-100",
              )}
            >
              {sortLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {rides === null ? (
        <Spinner label="Loading rides…" />
      ) : results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<CarFront className="size-10" />}
            title="No rides match your search"
            description={
              hasFilters
                ? "Try a nearby pickup point, a different date, or fewer seats."
                : "No upcoming rides have been posted yet. Offer one and passengers will find you."
            }
            action={<ButtonLink href="/rides/new">Offer a ride</ButtonLink>}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map((group) => (
            <section key={group[0].date.toDateString()}>
              <h2 className="mb-3 text-xs font-bold tracking-wider text-ink-muted uppercase">
                {formatDayHeading(group[0].date)}
              </h2>
              {/* Single column on every breakpoint: rides read as one list. */}
              <div className="flex flex-col gap-4">
                {group.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
