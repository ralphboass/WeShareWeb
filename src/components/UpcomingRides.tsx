"use client";

import { useEffect, useState } from "react";
import { CarFront } from "lucide-react";
import { filterRides, subscribeToRides } from "@/lib/rides";
import type { Ride } from "@/lib/types";
import { RideCard } from "./RideCard";
import { ButtonLink, EmptyState, Spinner } from "./ui";

/** Next departing rides, used on the landing page. */
export function UpcomingRides({ limit = 4 }: { limit?: number }) {
  const [rides, setRides] = useState<Ride[] | null>(null);

  useEffect(
    () => subscribeToRides((next) => setRides(next), () => setRides([])),
    [],
  );

  if (rides === null) return <Spinner label="Loading rides…" />;

  const upcoming = filterRides(rides, {}).slice(0, limit);

  if (upcoming.length === 0) {
    return (
      <EmptyState
        icon={<CarFront className="size-10" />}
        title="No rides posted yet"
        description="Be the first to offer a ride on your route — it takes less than a minute."
        action={<ButtonLink href="/rides/new">Offer a ride</ButtonLink>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {upcoming.map((ride) => (
        <RideCard key={ride.id} ride={ride} />
      ))}
    </div>
  );
}
