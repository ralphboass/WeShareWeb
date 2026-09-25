import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { EmailVerificationGate } from "@/components/EmailVerificationGate";
import { InstagramBanner } from "@/components/InstagramBanner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weshare-ride.com"),
  title: {
    default: "WeShare - share the ride, skip the traffic",
    template: "%s · WeShare",
  },
  description:
    "Student ride sharing across Southern California. Find rides, book seats instantly, split costs, and skip the traffic. Safe, verified, and built for students.",
  keywords: [
    "ride sharing",
    "UCLA rides",
    "USC rides",
    "carpool Los Angeles",
    "student carpool",
    "WeShare",
    "campus rideshare",
  ],
  openGraph: {
    title: "WeShare Ride — Share the ride, skip the traffic",
    description:
      "Student ride sharing across Southern California. Search rides, book a seat, and split the cost.",
    url: "https://weshare-ride.com",
    siteName: "WeShare Ride",
    images: ["/og.svg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeShare Ride",
    description: "Share the ride, skip the traffic.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <AuthProvider>
          <DemoModeBanner />
          <Navbar />
          <main className="flex-1">
            <EmailVerificationGate>{children}</EmailVerificationGate>
          </main>
          <Footer />
          <InstagramBanner />
        </AuthProvider>
        {/* Page views and visitor counts, reported to the Vercel dashboard.
            Self-hosted through /_vercel/insights, so ad blockers that filter
            third-party analytics domains do not stop it. */}
        <Analytics />
      </body>
    </html>
  );
}
