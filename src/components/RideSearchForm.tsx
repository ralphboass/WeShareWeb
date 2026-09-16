"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Search, Users } from "lucide-react";
import { Button, cx } from "./ui";

/**
 * Search bar used on the landing page and the rides page. Submitting pushes the
 * query into the URL so results are shareable.
 */
export function RideSearchForm({
  initial,
  variant = "hero",
  suggestions,
  onSearch,
}: {
  initial?: { from?: string; to?: string; date?: string; seats?: number };
  variant?: "hero" | "inline";
  /** Place names taken from the current ride listings. */
  suggestions?: string[];
  onSearch?: (filters: {
    from: string;
    to: string;
    date: string;
    seats: number;
  }) => void;
}) {
  const router = useRouter();
  const listId = useId();
  const [from, setFrom] = useState(initial?.from ?? "");
  const [to, setTo] = useState(initial?.to ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [seats, setSeats] = useState(initial?.seats ?? 1);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const filters = { from: from.trim(), to: to.trim(), date, seats };
    if (onSearch) {
      onSearch(filters);
      return;
    }
    const params = new URLSearchParams();
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.date) params.set("date", filters.date);
    if (filters.seats > 1) params.set("seats", String(filters.seats));
    router.push(`/rides${params.size ? `?${params}` : ""}`);
  };

  const cell =
    "flex items-center gap-2 rounded-xl bg-neutral-100 px-3.5 py-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200";
  const input =
    "w-full min-w-0 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-neutral-400";

  return (
    <form
      onSubmit={submit}
      className={cx(
        "w-full rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg shadow-brand-900/5",
        variant === "hero" ? "sm:p-4" : "",
      )}
    >
      <div className="grid gap-2 lg:grid-cols-[1fr_1fr_auto_auto_auto]">
        {/* Plain text search over the ride listings themselves (smart label,
            city and address) — no geocoding, so partial names match. */}
        <div className={cell}>
          <MapPin className="size-4 shrink-0 text-red-500" />
          <input
            className={input}
            placeholder="Leaving from"
            aria-label="Leaving from"
            list={suggestions?.length ? `${listId}-from` : undefined}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
          {suggestions?.length ? (
            <datalist id={`${listId}-from`}>
              {suggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          ) : null}
        </div>

        <div className={cell}>
          <MapPin className="size-4 shrink-0 text-emerald-500" />
          <input
            className={input}
            placeholder="Going to"
            aria-label="Going to"
            list={suggestions?.length ? `${listId}-to` : undefined}
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
          {suggestions?.length ? (
            <datalist id={`${listId}-to`}>
              {suggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          ) : null}
        </div>

        <div className={cx(cell, "lg:w-44")}>
          <CalendarDays className="size-4 shrink-0 text-brand-600" />
          <input
            type="date"
            className={input}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-label="Date"
          />
        </div>

        <div className={cx(cell, "lg:w-32")}>
          <Users className="size-4 shrink-0 text-brand-600" />
          <select
            className={cx(input, "cursor-pointer")}
            value={seats}
            onChange={(event) => setSeats(Number(event.target.value))}
            aria-label="Seats"
          >
            {[1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>
                {value} seat{value === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="lg:px-6">
          <Search className="size-4" />
          Search
          <ArrowRight className="size-4 lg:hidden" />
        </Button>
      </div>
    </form>
  );
}
