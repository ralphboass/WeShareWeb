import type { Ride } from "./types";

// Inlined rather than imported from ./rides, which imports this module.
const combine = (date: Date, time: Date) => {
  const combined = new Date(date);
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return combined;
};

/**
 * Sample rides used only when Firebase env vars are missing, so the UI can be
 * reviewed without credentials. Anything that writes is disabled in that mode.
 */
export function demoRides(): Ride[] {
  const day = (offset: number, hour: number, minute = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    date.setHours(0, 0, 0, 0);
    const time = new Date(date);
    time.setHours(hour, minute, 0, 0);
    return { date, time };
  };

  const seeds: Array<Omit<Ride, "id" | "dateTime">> = [
    {
      riderId: "demo-driver-1",
      riderName: "Ralph B.",
      departure: "UCLA",
      departureAddress: "Hilgard Ave, 405, Los Angeles, CA",
      destination: "LAX",
      destinationAddress: "World Way, 1, Los Angeles, CA",
      ...day(0, 17, 30),
      availableSeats: 3,
      totalSeats: 4,
      bookedSeats: 1,
      price: 12,
      status: "scheduled",
      note: "Trunk space for one carry-on each.",
    },
    {
      riderId: "demo-driver-2",
      riderName: "Maria S.",
      departure: "Santa Monica",
      departureAddress: "3rd Street Promenade, Santa Monica, CA",
      destination: "UCLA",
      destinationAddress: "Charles E Young Dr, Los Angeles, CA",
      ...day(1, 8, 15),
      availableSeats: 2,
      totalSeats: 3,
      bookedSeats: 1,
      price: 7,
      status: "scheduled",
    },
    {
      riderId: "demo-driver-3",
      riderName: "Jonas K.",
      departure: "UCLA",
      departureAddress: "Westwood Plaza, Los Angeles, CA",
      destination: "San Diego",
      destinationAddress: "Gaslamp Quarter, San Diego, CA",
      ...day(2, 14, 0),
      availableSeats: 4,
      totalSeats: 4,
      bookedSeats: 0,
      price: 28,
      status: "scheduled",
      note: "Leaving right after class, one stop in Irvine.",
    },
    {
      riderId: "demo-driver-4",
      riderName: "Amira T.",
      departure: "Pasadena",
      departureAddress: "Colorado Blvd, Pasadena, CA",
      destination: "UCLA",
      destinationAddress: "Sunset Blvd, Los Angeles, CA",
      ...day(3, 7, 45),
      availableSeats: 1,
      totalSeats: 3,
      bookedSeats: 2,
      price: 9,
      status: "scheduled",
    },
  ];

  return seeds.map((seed, index) => ({
    ...seed,
    id: `demo-ride-${index + 1}`,
    dateTime: combine(seed.date, seed.time),
  }));
}
