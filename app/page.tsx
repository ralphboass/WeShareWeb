import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              WeShare
              <span className="block text-blue-700 slogan-font">
                Share the ride, skip the traffic
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
              Ride sharing made simple in Los Angeles. Match rides in minutes and save on your commute.
            </p>
            <div className="mt-10">
              <Link
                href="#download"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Download Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 sm:px-10 md:px-16 lg:px-24 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Built for LA commuters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Easy Matching</h3>
              <p className="text-gray-600">
                Find riders or drivers heading your way with our smart matching algorithm.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Split costs and save up to 60% on your daily commute.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">
                Get where you need to go without the hassle of traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Download the app, set your route, and start sharing rides today.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/weshare-web1.jpg"
              alt="WeShare app preview"
              width={800}
              height={600}
              className="w-full max-w-2xl h-auto object-contain rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Ready to start sharing?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of LA commuters saving time and money with WeShare.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
            >
              Download for iOS
            </a>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition-colors"
            >
              Download for Android
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
