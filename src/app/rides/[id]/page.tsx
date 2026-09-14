import type { Metadata } from "next";
import { RideDetail } from "@/components/RideDetail";

export const metadata: Metadata = {
  title: "Ride details",
  description: "Route, driver, seats and price for this WeShare ride.",
};

export default async function RidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RideDetail rideId={id} />;
}
