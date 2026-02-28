'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-purple-600">We</span>
              <span className="text-black">Share</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/rides" className="text-neutral-700 hover:text-blue-600 font-medium transition">
              Find Rides
            </Link>
            {user && (
              <>
                <Link href="/my-rides" className="text-neutral-700 hover:text-blue-600 font-medium transition">
                  My Rides
                </Link>
                <Link href="/messages" className="text-neutral-700 hover:text-blue-600 font-medium transition">
                  Messages
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-neutral-700 hover:text-blue-600 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user.firstName}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-neutral-700 hover:text-blue-600 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-neutral-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/rides"
              className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Rides
            </Link>
            {user && (
              <>
                <Link
                  href="/my-rides"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Rides
                </Link>
                <Link
                  href="/messages"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-neutral-700 hover:bg-red-50 hover:text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
