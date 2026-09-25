import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  MessageCircle,
  PiggyBank,
  Route,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { RideSearchForm } from "@/components/RideSearchForm";
import { UpcomingRides } from "@/components/UpcomingRides";
import { APP_STORE_URL } from "@/components/Footer";
import { AppStoreButton, GooglePlayButton } from "@/components/StoreBadges";
import { Badge, ButtonLink, Card } from "@/components/ui";

const features = [
  {
    icon: Route,
    title: "Real-time ride matching",
    body: "See every seat leaving your campus or neighbourhood, with clear pickup points and flexible departure times.",
  },
  {
    icon: PiggyBank,
    title: "Save money and time",
    body: "Split the cost of the drive, use HOV lanes where applicable, and cut your commute by sharing the ride.",
  },
  {
    icon: ShieldCheck,
    title: "Safety and reliability",
    body: "Verified student emails, ratings and reviews, and full trip details before you ever get in the car.",
  },
];

const steps = [
  {
    title: "Search a route",
    body: "Enter where you're leaving from and where you're headed. Filter by date and number of seats.",
  },
  {
    title: "Request a seat",
    body: "Pay securely with your card. We only authorize the amount — you're charged after the ride happens.",
  },
  {
    title: "Ride together",
    body: "Chat with your driver, meet at the pickup point, and split the cost of the drive.",
  },
];

const appPerks = [
  "Secure card payments with Stripe",
  "Push notifications for booking requests",
  "Live chat with your driver or passengers",
  "Wallet, credits and ride history",
];

const screenshots = [
  { src: "/screenshot1.PNG", alt: "WeShare home screen with ride map" },
  { src: "/screenshot2.PNG", alt: "WeShare ride details screen" },
  { src: "/screenshot3.PNG", alt: "WeShare rides list" },
  { src: "/screenshot4.PNG", alt: "WeShare profile screen" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="app-gradient absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-16 pb-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge>
              <BadgeCheck className="size-3.5" />
              Student ride sharing in Los Angeles
            </Badge>

            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Share the ride,
              <br />
              <span className="wordmark-we">skip the traffic</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              WeShare connects students at UCLA, USC, and across LA to share
              rides, reduce costs and beat congestion. Find a seat in minutes,
              book it online, and get where you&apos;re going together.
            </p>

            {/* On phones the app is the better experience, so it leads. */}
            <div className="mt-7 flex flex-col gap-3 sm:hidden">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Download the app
                <ArrowRight className="size-4" />
              </a>
              <ButtonLink href="/rides" variant="secondary">
                Find a ride
              </ButtonLink>
            </div>

            <div className="mt-7 hidden gap-3 sm:flex">
              <ButtonLink href="/rides">
                Find a ride
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/rides/new" variant="secondary">
                Offer a ride
              </ButtonLink>
            </div>

            <div className="mt-6 flex items-center gap-2.5">
              <span className="status-dot" />
              <p className="text-sm text-ink-soft">
                Book on the web or in the{" "}
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-600 hover:underline"
                >
                  iOS app
                </a>
              </p>
            </div>
          </div>

          {/* Hidden on phones: the hero reads better without it on a narrow
              screen, and it saves a 2 MB image on mobile data. */}
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-white/40 blur-2xl" />
            <Image
              src="/screenshot1.PNG"
              alt="WeShare app home screen"
              width={722}
              height={1564}
              priority
              className="mx-auto w-64 rounded-[2rem] border border-white/70 shadow-2xl shadow-brand-900/20 sm:w-72"
            />
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-5 pb-16">
          <RideSearchForm />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                Rides leaving soon
              </h2>
              <p className="mt-1 text-ink-muted">
                Live seats posted by drivers in the WeShare community.
              </p>
            </div>
            <Link
              href="/rides"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
            >
              See all rides
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8">
            <UpcomingRides limit={4} />
          </div>
        </div>
      </section>

      <section className="hero-gradient py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">
            Built for commuters
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{feature.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                How booking works
              </h2>
              <ol className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{step.title}</p>
                      <p className="mt-1 text-sm text-ink-soft">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="size-4 text-brand-600" />
                  Card charged after the ride
                </span>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4 text-brand-600" />
                  Chat with your driver
                </span>
              </div>

              <ButtonLink href="/how-it-works" variant="secondary" className="mt-8">
                Read the details
              </ButtonLink>
            </div>

            {/* Screenshots are desktop-only: on a phone they add weight and the
                real app is one tap away instead. */}
            <div className="hidden gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-4">
              {screenshots.map((shot) => (
                <Image
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  width={722}
                  height={1564}
                  className="w-full rounded-2xl border border-brand-100 shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="download"
        className="bg-gradient-to-b from-white via-brand-50/60 to-white px-5 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl shadow-brand-900/10">
            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              <div className="p-10 sm:p-14">
                <Badge className="text-base">
                  <Smartphone className="size-4" />
                  Download the iOS app
                </Badge>

                <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                  Get the full experience
                </h2>
                <p className="mt-5 text-lg text-ink-soft">
                  Everything on this site works in the app too — plus the extras
                  a browser can&apos;t give you.
                </p>

                <ul className="mt-8 space-y-4">
                  {appPerks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100">
                        <Check
                          className="size-4 text-brand-700"
                          strokeWidth={3}
                        />
                      </span>
                      <span className="text-base text-ink-soft">{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap gap-4">
                  <AppStoreButton />
                  <GooglePlayButton />
                </div>
              </div>

              {/* Phone bleeds off the bottom of the gradient panel, with the QR
                  card centered in the blue section. */}
              <div className="relative flex min-h-96 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-600 to-purple-600 p-8">
                <Image
                  src="/screenshot2.PNG"
                  alt="WeShare ride details screen"
                  width={722}
                  height={1564}
                  className="absolute -right-4 bottom-[-10%] w-48 rotate-6 rounded-[1.75rem] border-4 border-white/80 shadow-2xl sm:w-56"
                />

                <div className="relative z-10 rounded-2xl bg-white p-5 shadow-2xl">
                  <Image
                    src="/QR.png"
                    alt="QR code to download the WeShare app"
                    width={200}
                    height={200}
                    className="size-36 rounded-lg sm:size-40"
                  />
                  <p className="mt-3 text-center text-xs font-semibold text-ink-muted">
                    Scan to download
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
