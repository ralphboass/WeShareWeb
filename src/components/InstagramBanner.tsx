"use client";

import { useState, useEffect } from "react";
import { X, Trophy } from "lucide-react";

// Instagram icon as SVG component
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function InstagramBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem("instagram-banner-dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show banner after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("instagram-banner-dismissed", "true");
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-[2px] shadow-2xl">
          <div className="relative rounded-2xl bg-white p-6 sm:p-8">
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-full p-1.5 text-ink-muted transition hover:bg-neutral-100 hover:text-ink"
              aria-label="Dismiss"
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 shadow-lg">
                <InstagramIcon className="size-10 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Trophy className="size-5 text-orange-600" />
                  <h3 className="text-xl font-bold text-ink sm:text-2xl">
                    Intro Week Challenge!
                  </h3>
                </div>
                <p className="mt-2 text-sm text-ink-soft sm:text-base">
                  Join the WeShare community on Instagram for exclusive intro
                  week challenges, prizes, and updates. Join and win among other things a BEATS Bluetooth speaker! 
                </p>

                <a
                  href="https://www.instagram.com/weshareride/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    localStorage.setItem("instagram-banner-dismissed", "true");
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
                >
                  @weshareride
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
