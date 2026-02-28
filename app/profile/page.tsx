'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking, Ride } from '@/types';
import { User, Wallet, Car, Star, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const bookingsQuery = query(bookingsRef, where('passengerId', '==', user.id));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
          rideDate: doc.data().rideDate?.toDate(),
          rideTime: doc.data().rideTime?.toDate(),
        })) as Booking[];
        setBookings(bookingsData);

        const ridesRef = collection(db, 'rides');
        const ridesQuery = query(ridesRef, where('riderId', '==', user.id));
        const ridesSnapshot = await getDocs(ridesQuery);
        const ridesData = ridesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate(),
          time: doc.data().time?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Ride[];
        setMyRides(ridesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-neutral-600">{user.email}</p>
                {user.uclaVerified && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    UCLA Verified
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-neutral-600" />
                    <span className="text-sm font-medium">Wallet Balance</span>
                  </div>
                  <span className="font-bold text-lg">${user.walletBalance.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-neutral-600" />
                    <span className="text-sm font-medium">Total Trips</span>
                  </div>
                  <span className="font-bold text-lg">{user.numberOfTrips}</span>
                </div>

                {user.driverRating && (
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium">Driver Rating</span>
                    </div>
                    <span className="font-bold text-lg">{user.driverRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => signOut()}
                className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Rides as Driver */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">My Rides (Driver)</h3>
                <Link
                  href="/create-ride"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Create Ride
                </Link>
              </div>

              {myRides.length === 0 ? (
                <p className="text-neutral-600 text-center py-8">You haven't created any rides yet</p>
              ) : (
                <div className="space-y-3">
                  {myRides.slice(0, 3).map((ride) => (
                    <Link
                      key={ride.id}
                      href={`/rides/${ride.id}`}
                      className="block p-4 border border-neutral-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-semibold mb-1">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            {ride.departure} → {ride.destination}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(ride.date).toLocaleDateString()}
                            </span>
                            <span>{ride.availableSeats} seats available</span>
                            <span className="font-semibold text-neutral-900">${ride.price}/seat</span>
                          </div>
                        </div>
                        {ride.isCancelled && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* My Bookings as Passenger */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">My Bookings (Passenger)</h3>

              {bookings.length === 0 ? (
                <p className="text-neutral-600 text-center py-8">You haven't booked any rides yet</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 border border-neutral-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-semibold mb-1">
                            <MapPin className="w-4 h-4 text-green-600" />
                            {booking.departure} → {booking.destination}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(booking.rideDate).toLocaleDateString()}
                            </span>
                            <span>{booking.seatsBooked} seat(s)</span>
                            <span className="font-semibold text-neutral-900">${booking.amountPaid}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600">
                        Driver: {booking.driverName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
