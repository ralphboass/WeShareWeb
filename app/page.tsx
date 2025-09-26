// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Hero */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-24 pt-20 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="inline-block text-sm font-semibold tracking-wide text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              UCLA Ride Sharing!
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              WeShare
              <span className="block text-blue-700 slogan-font">Share the ride, skip the traffic</span>
            </h1>
            <p className="text-lg text-neutral-700">
              WeShare connects UCLA students to share rides, reduce costs,
              and beat congestion. Match rides in minutes and get to where you're going
              faster—together.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#download"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-5 py-3 font-medium shadow hover:bg-blue-700 transition"
              >
                Download the App
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-blue-200 text-blue-700 px-5 py-3 font-medium hover:bg-blue-50 transition"
              >
                See Features
              </a>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <p className="text-sm text-neutral-600">
                Available soon on iOS and Android
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full rounded-xl border border-blue-100 bg-white/60 shadow-sm overflow-hidden">
            <Image
              src="/weshare-web1.jpg"
              alt="WeShare app preview"
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 sm:px-10 md:px-16 lg:px-24 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Built for LA commuters</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 p-6 hover:shadow-sm transition">
              <div className="mb-3 h-10 w-10 rounded-lg bg-blue-100 grid place-items-center text-blue-700 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Real-time ride matching</h3>
              <p className="text-neutral-600">
                Get paired with riders heading your way. Flexible departure times,
                clear pickup points.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-6 hover:shadow-sm transition">
              <div className="mb-3 h-10 w-10 rounded-lg bg-yellow-100 grid place-items-center text-yellow-600 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Save money and time</h3>
              <p className="text-neutral-600">
                Split costs, use HOV lanes where applicable, and cut your commute
                by sharing the ride.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-6 hover:shadow-sm transition">
              <div className="mb-3 h-10 w-10 rounded-lg bg-blue-100 grid place-items-center text-blue-700 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Safety and reliability</h3>
              <p className="text-neutral-600">
                Ratings, verified profiles, and clear trip details help keep every
                ride comfortable and predictable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Download / QR placeholder */}
      <section
        id="download"
        className="px-6 sm:px-10 md:px-16 lg:px-24 py-16 bg-gradient-to-b from-white to-yellow-50"
      >
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Get WeShare</h2>
            <p className="text-neutral-700 mb-6">
              Download the app and start sharing rides across LA. Scan the QR code
              or use the store links below.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white px-4 py-3 text-sm font-medium hover:bg-neutral-800 transition"
              >
                App Store (soon)
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white px-4 py-3 text-sm font-medium hover:bg-neutral-800 transition"
              >
                Google Play (soon)
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xs">
            <div className="aspect-square w-full rounded-2xl border-2 border-dashed border-yellow-400 grid place-items-center bg-white">
              <span className="text-neutral-500 text-sm">QR code placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 md:px-16 lg:px-24 py-10 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-neutral-600">
            © {new Date().getFullYear()} WeShare. All rights reserved.
          </p>
          <div className="text-sm text-neutral-500">
            Los Angeles, CA
          </div>
        </div>
      </footer>
    </div>
  );
}
