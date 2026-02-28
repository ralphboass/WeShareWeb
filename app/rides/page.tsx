'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Ride } from '@/types';
import { MapPin, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RidesPage() {
  const searchParams = useSearchParams();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    departure: searchParams.get('departure') || '',
    destination: searchParams.get('destination') || '',
    date: searchParams.get('date') || '',
    passengers: parseInt(searchParams.get('passengers') || '1'),
  });

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const now = new Date();
        const ridesRef = collection(db, 'rides');
        let q = query(
          ridesRef,
          where('date', '>=', Timestamp.fromDate(now)),
          orderBy('date', 'asc')
        );

        const snapshot = await getDocs(q);
        let ridesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate(),
          time: doc.data().time?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Ride[];

        ridesData = ridesData.filter(ride => 
          !ride.isCancelled && 
          ride.availableSeats >= filters.passengers
        );

        if (filters.departure) {
          ridesData = ridesData.filter(ride =>
            ride.departure.toLowerCase().includes(filters.departure.toLowerCase()) ||
            ride.departureAddress.toLowerCase().includes(filters.departure.toLowerCase())
          );
        }

        if (filters.destination) {
          ridesData = ridesData.filter(ride =>
            ride.destination.toLowerCase().includes(filters.destination.toLowerCase()) ||
            ride.destinationAddress.toLowerCase().includes(filters.destination.toLowerCase())
          );
        }

        if (filters.date) {
          const filterDate = new Date(filters.date);
          ridesData = ridesData.filter(ride => {
            const rideDate = new Date(ride.date);
            return rideDate.toDateString() === filterDate.toDateString();
          });
        }

        setRides(ridesData);
      } catch (error) {
        console.error('Error fetching rides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [filters]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (time: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(time);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Rides</h1>
          <p className="text-neutral-600">Find and book rides with UCLA students</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">From</label>
              <input
                type="text"
                placeholder="Departure"
                value={filters.departure}
                onChange={(e) => setFilters({ ...filters, departure: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">To</label>
              <input
                type="text"
                placeholder="Destination"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Passengers</label>
              <select
                value={filters.passengers}
                onChange={(e) => setFilters({ ...filters, passengers: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rides List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-neutral-600 text-lg mb-4">No rides found matching your criteria</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Try a different search
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <Link
                key={ride.id}
                href={`/rides/${ride.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          {ride.departure}
                        </div>
                        <div className="text-sm text-neutral-500 ml-7">{ride.departureAddress}</div>
                      </div>
                      <div className="text-neutral-400">→</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                          <MapPin className="w-5 h-5 text-green-600" />
                          {ride.destination}
                        </div>
                        <div className="text-sm text-neutral-500 ml-7">{ride.destinationAddress}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(ride.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(ride.time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {ride.availableSeats} seats available
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-neutral-900">
                        <DollarSign className="w-4 h-4" />
                        ${ride.price} per seat
                      </div>
                    </div>

                    {ride.note && (
                      <div className="mt-3 text-sm text-neutral-600 bg-neutral-50 p-3 rounded">
                        {ride.note}
                      </div>
                    )}
                  </div>

                  <div className="md:text-right">
                    <div className="text-sm text-neutral-600 mb-2">Driver</div>
                    <div className="font-semibold">{ride.riderName}</div>
                    <button className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
