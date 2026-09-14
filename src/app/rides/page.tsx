import { Suspense } from "react";
import type { Metadata } from "next";
import { RidesBrowser } from "@/components/RidesBrowser";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = {
  title: "Find a ride",
  description:
    "Search rides shared by students across Los Angeles. Filter by route, date and seats, then book online.",
};

export default function RidesPage() {
  return (
    <Suspense fallback={<Spinner label="Loading rides…" />}>
      <RidesBrowser />
    </Suspense>
  );
}
