'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Ride } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const departureIcon = createCustomIcon('#3b82f6');
const destinationIcon = createCustomIcon('#10b981');

export default function RideMap() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const now = new Date();
        const ridesRef = collection(db, 'rides');
        const q = query(
          ridesRef,
          where('date', '>=', Timestamp.fromDate(now))
        );
        
        const snapshot = await getDocs(q);
        const ridesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate(),
          time: doc.data().time?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Ride[];

        const futureRides = ridesData.filter(ride => !ride.isCancelled && ride.availableSeats > 0);
        setRides(futureRides.slice(0, 20));
      } catch (error) {
        console.error('Error fetching rides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading map...</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = [34.0689, -118.4452];

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      className="z-0 rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {rides.length === 0 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-[1000] text-center">
          <p className="text-neutral-700 font-medium mb-2">No rides available</p>
          <p className="text-sm text-neutral-500">Check back later for new rides</p>
        </div>
      ) : (
        <>
          {rides.map((ride) => {
            const depLat = 34.0689 + (Math.random() - 0.5) * 0.2;
            const depLng = -118.4452 + (Math.random() - 0.5) * 0.2;
            const destLat = 34.0689 + (Math.random() - 0.5) * 0.2;
            const destLng = -118.4452 + (Math.random() - 0.5) * 0.2;

            return (
              <div key={ride.id}>
                <CircleMarker
                  center={[depLat, depLng]}
                  radius={8}
                  pathOptions={{ 
                    fillColor: '#3b82f6', 
                    color: 'white', 
                    weight: 2, 
                    fillOpacity: 0.9 
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-sm mb-2">{ride.departure}</h3>
                      <p className="text-xs text-neutral-600 mb-1">→ {ride.destination}</p>
                      <p className="text-xs text-neutral-600 mb-2">
                        {new Date(ride.date).toLocaleDateString()} at {new Date(ride.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-neutral-600">{ride.availableSeats} seats</span>
                        <span className="font-semibold text-blue-600">${ride.price}/seat</span>
                      </div>
                      <Link
                        href={`/rides/${ride.id}`}
                        className="block w-full text-center bg-blue-600 text-white py-1 px-3 rounded text-xs font-medium hover:bg-blue-700 transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
                
                <CircleMarker
                  center={[destLat, destLng]}
                  radius={8}
                  pathOptions={{ 
                    fillColor: '#10b981', 
                    color: 'white', 
                    weight: 2, 
                    fillOpacity: 0.9 
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="text-xs font-semibold">{ride.destination}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              </div>
            );
          })}
        </>
      )}
    </MapContainer>
  );
}
