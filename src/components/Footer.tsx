import Link from "next/link";
import { Wordmark } from "./Wordmark";

export const APP_STORE_URL =
  "https://apps.apple.com/dk/app/weshare-ride/id6754946645";
export const SUPPORT_EMAIL = "hello@weshare-ride.com";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark className="text-lg" />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Student ride sharing across Los Angeles. Share the ride, split the
            cost, skip the traffic.
          </p>
        </div>

        <nav className="text-sm">
          <p className="mb-3 font-semibold text-ink">Ride</p>
          <ul className="space-y-2 text-ink-muted">
            <li>
              <Link href="/rides" className="hover:text-brand-600">
                Find a ride
              </Link>
            </li>
            <li>
              <Link href="/rides/new" className="hover:text-brand-600">
                Offer a ride
              </Link>
            </li>
            <li>
              <Link href="/bookings" className="hover:text-brand-600">
                My trips
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-brand-600">
                How it works
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="text-sm">
          <p className="mb-3 font-semibold text-ink">Company</p>
          <ul className="space-y-2 text-ink-muted">
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-brand-600">
                Contact us
              </a>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-600">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-600">
                Terms of service
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-semibold text-ink">Get the app</p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Download on iOS
          </a>
          <p className="mt-3 text-ink-muted">Los Angeles, CA</p>
        </div>
      </div>

      <div className="border-t border-neutral-100 px-5 py-6 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} WeShare Ride. All rights reserved.
      </div>
    </footer>
  );
}
