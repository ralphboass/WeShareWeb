'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Ride } from '@/types';
import { MapPin, Calendar, Users, DollarSign, Clock, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import ChatModal from '@/components/ChatModal';
import BookingModal from '@/components/BookingModal';

export default function RideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const rideDoc = await getDoc(doc(db, 'rides', params.id as string));
        if (rideDoc.exists()) {
          const data = rideDoc.data();
          setRide({
            id: rideDoc.id,
            ...data,
            date: data.date?.toDate(),
            time: data.time?.toDate(),
            createdAt: data.createdAt?.toDate(),
          } as Ride);
        }
      } catch (error) {
        console.error('Error fetching ride:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [params.id]);

  const handleBooking = () => {
    if (!user) {
      router.push(`/login?redirect=/rides/${params.id}`);
      return;
    }
    setShowBookingModal(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (time: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(time);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 text-lg mb-4">Ride not found</p>
          <Link href="/rides" className="text-blue-600 hover:underline">
            Back to rides
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = ride.price * seatsToBook;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/rides"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to rides
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Ride Details</h1>
            <p className="text-neutral-600">Review the ride information and book your seat</p>
          </div>

          {/* Route */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  From: {ride.departure}
                </div>
                <div className="text-sm text-neutral-600 ml-7">{ride.departureAddress}</div>
              </div>
              <div className="ml-7 border-l-2 border-blue-300 h-8"></div>
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                  <MapPin className="w-5 h-5 text-green-600" />
                  To: {ride.destination}
                </div>
                <div className="text-sm text-neutral-600 ml-7">{ride.destinationAddress}</div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Date</div>
                <div className="flex items-center gap-2 font-semibold">
                  <Calendar className="w-5 h-5 text-neutral-400" />
                  {formatDate(ride.date)}
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Time</div>
                <div className="flex items-center gap-2 font-semibold">
                  <Clock className="w-5 h-5 text-neutral-400" />
                  {formatTime(ride.time)}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Available Seats</div>
                <div className="flex items-center gap-2 font-semibold">
                  <Users className="w-5 h-5 text-neutral-400" />
                  {ride.availableSeats} seats
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Price per Seat</div>
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <DollarSign className="w-5 h-5 text-neutral-400" />
                  ${ride.price}
                </div>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="mb-8 p-6 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold mb-3">Driver Information</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{ride.riderName}</div>
                <div className="text-sm text-neutral-600">UCLA Student</div>
              </div>
              {user && user.id !== ride.riderId && (
                <button 
                  onClick={() => setShowChat(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Driver
                </button>
              )}
            </div>
          </div>

          {/* Note */}
          {ride.note && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <div className="p-4 bg-neutral-50 rounded-lg text-neutral-700">
                {ride.note}
              </div>
            </div>
          )}

          {/* Booking Section */}
          {user?.id !== ride.riderId && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Book Your Seat</h3>
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium">Number of seats:</label>
                <select
                  value={seatsToBook}
                  onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: ride.availableSeats }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div className="ml-auto text-right">
                  <div className="text-sm text-neutral-600">Total Price</div>
                  <div className="text-2xl font-bold text-blue-600">${totalPrice}</div>
                </div>
              </div>
              <button
                onClick={handleBooking}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {user ? 'Book Now' : 'Sign In to Book'}
              </button>
              {!user && (
                <p className="text-sm text-neutral-600 text-center mt-3">
                  You need to sign in to book this ride
                </p>
              )}
            </div>
          )}

          {user?.id === ride.riderId && (
            <div className="border-t pt-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-blue-900 font-medium">This is your ride</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && ride && user && (
        <ChatModal
          rideId={ride.id}
          otherUserId={ride.riderId}
          otherUserName={ride.riderName}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal onClose={() => setShowBookingModal(false)} />
      )}
    </div>
  );
}
