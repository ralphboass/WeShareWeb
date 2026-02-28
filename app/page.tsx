'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

const RideMap = dynamic(() => import('@/components/RideMap'), { ssr: false });

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: '',
    passengers: 1,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      departure: searchParams.departure,
      destination: searchParams.destination,
      date: searchParams.date,
      passengers: searchParams.passengers.toString(),
    });
    window.location.href = `/rides?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Search */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block text-sm font-semibold tracking-wide text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-4">
              UCLA Ride Sharing
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              <span className="text-purple-600">We</span>
              <span className="text-black">Share</span>
              <span className="block text-blue-600 mt-2">Share the ride, skip the traffic</span>
            </h1>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
              Find and share rides with UCLA students. Save money, reduce traffic, and travel together.
            </p>
          </div>

          {/* Search and Map Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mt-12">
            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 h-fit">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-600" />
                Find a Ride
              </h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    From
                  </label>
                  <input
                    type="text"
                    placeholder="Departure location"
                    value={searchParams.departure}
                    onChange={(e) => setSearchParams({ ...searchParams, departure: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    To
                  </label>
                  <input
                    type="text"
                    placeholder="Destination"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={searchParams.date}
                    onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Passengers
                  </label>
                  <select
                    value={searchParams.passengers}
                    onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search Rides
                </button>

                <Link
                  href="/rides"
                  className="block w-full text-center border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Browse All Rides
                </Link>
              </form>
            </div>

            {/* Map View */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[500px] lg:h-[600px]">
              <RideMap />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose WeShare?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-neutral-600">
                Split gas costs and reduce your commute expenses by sharing rides with fellow students.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meet People</h3>
              <p className="text-neutral-600">
                Connect with other UCLA students and build your campus community while traveling.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Go Anywhere</h3>
              <p className="text-neutral-600">
                Find rides to campus, airports, events, and anywhere else you need to go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Get the Full Experience
                </h2>
                <p className="text-lg text-neutral-700 mb-6">
                  Download the WeShare mobile app to book rides, make payments, and stay connected on the go.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">Secure payments with Stripe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">Real-time ride tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">Push notifications for bookings</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition"
                  >
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    App Store
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition"
                  >
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    Google Play
                  </a>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 md:p-12 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white font-semibold mb-4">Scan to Download</p>
                  <div className="bg-white p-6 rounded-2xl shadow-xl inline-block">
                    <Image
                      src="/QR.png"
                      alt="Download WeShare App QR Code"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-white text-sm mt-4 opacity-90">Available on iOS & Android</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Browse rides on the web</h2>
          <p className="text-lg text-neutral-700 mb-8">
            Search for rides and connect with drivers. Download the app to complete bookings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign Up Now
            </Link>
            <Link
              href="/rides"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse Rides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
