'use client';

import { X, Smartphone } from 'lucide-react';
import Image from 'next/image';

interface BookingModalProps {
  onClose: () => void;
}

export default function BookingModal({ onClose }: BookingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Download the App to Book</h3>
          <p className="text-neutral-600 mb-6">
            To complete your booking and make payments, please download the WeShare mobile app.
          </p>

          <div className="bg-neutral-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-neutral-700 mb-4">Scan the QR code to download:</p>
            <div className="w-48 h-48 bg-white border-2 border-neutral-200 rounded-xl mx-auto flex items-center justify-center">
              <Image
                src="/QR.png"
                alt="Download WeShare App"
                width={180}
                height={180}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="#"
              className="block w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition"
            >
              Download on App Store
            </a>
            <a
              href="#"
              className="block w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition"
            >
              Get it on Google Play
            </a>
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-neutral-600 hover:text-neutral-900 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
