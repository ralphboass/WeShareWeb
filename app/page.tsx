'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

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

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start sharing rides?</h2>
          <p className="text-lg text-neutral-700 mb-8">
            Join thousands of UCLA students already saving money and reducing traffic.
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
