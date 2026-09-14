import type { Metadata } from "next";
import {
  BadgeCheck,
  CalendarClock,
  Car,
  CreditCard,
  DollarSign,
  MessageCircle,
  Search,
  ShieldCheck,
  Ticket,
  Wallet,
} from "lucide-react";
import { APP_STORE_URL } from "@/components/Footer";
import { Badge, ButtonLink, Card, Panel } from "@/components/ui";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How WeShare Ride works for passengers and drivers: search a ride, request a seat, and pay only after the trip.",
};

const riderSteps = [
  {
    icon: Search,
    title: "Search rides",
    body: "Enter where you're leaving from, where you're going and when. Browse student drivers heading the same way with the price per seat up front.",
  },
  {
    icon: Ticket,
    title: "Request a seat",
    body: "Pick how many seats you need and add your card. We authorize the amount so the driver knows you're serious — nothing is charged yet.",
  },
  {
    icon: BadgeCheck,
    title: "The driver accepts",
    body: "You'll get a notification the moment your request is accepted, and a chat opens so you can agree on the exact pickup spot.",
  },
  {
    icon: CreditCard,
    title: "Pay after the ride",
    body: "Your card is only captured once the ride is completed. If the ride is cancelled or never happens, the authorization is released.",
  },
];

const driverSteps = [
  {
    icon: Car,
    title: "Post your ride",
    body: "Add your route, departure time, how many seats are free and any detail passengers should know about your car.",
  },
  {
    icon: DollarSign,
    title: "Set your price per seat",
    body: "WeShare is cost-sharing, so price your seats to help cover gas and tolls — not to turn a profit.",
  },
  {
    icon: MessageCircle,
    title: "Accept requests",
    body: "Review each passenger's profile and rating, accept the ones that work for you, and message them before departure.",
  },
  {
    icon: Wallet,
    title: "Get paid out",
    body: "After the trip is completed, your earnings are sent to your bank account through Stripe payouts.",
  },
];

const faqs = [
  {
    question: "When exactly is my card charged?",
    answer:
      "Your card is authorized when you request a seat and captured only after the ride has been completed. Until then it's a hold, not a charge.",
  },
  {
    question: "What does a seat cost?",
    answer:
      "You pay the driver's seat price plus a 5% WeShare service fee, which covers payment processing, support and keeping the platform running.",
  },
  {
    question: "How do drivers receive their money?",
    answer:
      "Drivers are paid through Stripe. Once the trip is completed, the payout is released to the bank account connected to their Stripe account.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Yes. Cancellations are free up to 2 hours before departure. Inside that 2-hour cutoff the seat can no longer be cancelled online, because the driver is already planning the trip around you — message them and contact support if something urgent comes up.",
  },
  {
    question: "Who can use WeShare?",
    answer:
      "Anyone 18 or older, though WeShare is built around students in Los Angeles. Sign up with a .edu address and you'll get a verified student badge on your profile.",
  },
  {
    question: "Do I need the iOS app?",
    answer:
      "No — you can search, book and manage rides right here on the web. The iOS app adds push notifications for requests and messages.",
  },
];

function Track({
  eyebrow,
  title,
  description,
  steps,
}: {
  eyebrow: string;
  title: string;
  description: string;
  steps: typeof riderSteps;
}) {
  return (
    <Card>
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>

      <ol className="mt-6 space-y-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <step.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                <span className="text-ink-muted">{index + 1}. </span>
                {step.title}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default function HowItWorksPage() {
  return (
    <div>
      <section className="hero-gradient">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <Badge>How it works</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Share the ride, split the cost
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft">
            WeShare connects students driving across Los Angeles with students
            heading the same way. Two sides, one simple flow — and you only pay
            once the ride actually happens.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <Track
            eyebrow="For passengers"
            title="Riding with WeShare"
            description="Find a seat in a student's car, agree on the pickup and pay after you arrive."
            steps={riderSteps}
          />
          <Track
            eyebrow="For drivers"
            title="Driving with WeShare"
            description="Fill your empty seats on a drive you're already making and cover your fuel."
            steps={driverSteps}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Panel>
            <ShieldCheck className="size-5 text-brand-600" />
            <p className="mt-2 text-sm font-semibold text-ink">
              Authorize now, charge later
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              We place a hold when you request a seat and capture it only after
              the ride is completed.
            </p>
          </Panel>
          <Panel>
            <CreditCard className="size-5 text-brand-600" />
            <p className="mt-2 text-sm font-semibold text-ink">
              Seat price + 5% service fee
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Passengers pay the driver&apos;s seat price plus a 5% WeShare
              service fee. Drivers are paid out via Stripe after the trip.
            </p>
          </Panel>
          <Panel>
            <CalendarClock className="size-5 text-brand-600" />
            <p className="mt-2 text-sm font-semibold text-ink">
              2-hour cancellation cutoff
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Cancel for free up to 2 hours before departure. After that the seat
              is locked in for the driver.
            </p>
          </Panel>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">
            Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {faqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink">
                  {faq.question}
                  <span className="text-xl leading-none text-ink-muted transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="download-gradient mt-16 rounded-xl border border-neutral-200 px-6 py-12 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">
            Ready to go somewhere?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
            Search rides in seconds, or get the iOS app for push notifications on
            requests and messages.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/rides">Find a ride</ButtonLink>
            <ButtonLink
              href={APP_STORE_URL}
              variant="dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download on iOS
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
  );
}
