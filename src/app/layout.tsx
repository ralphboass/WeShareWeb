import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DemoModeBanner } from "@/components/DemoModeBanner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weshare-ride.com"),
  title: {
    default: "WeShare Ride — Share the ride, skip the traffic",
    template: "%s · WeShare Ride",
  },
  description:
    "WeShare connects UCLA and LA students to share rides. Search rides, book a seat in minutes, and split the cost of the drive.",
  keywords: [
    "ride sharing",
    "UCLA rides",
    "carpool Los Angeles",
    "student carpool",
    "WeShare",
  ],
  openGraph: {
    title: "WeShare Ride — Share the ride, skip the traffic",
    description:
      "Student ride sharing across Los Angeles. Search rides, book a seat, and split the cost.",
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
  icons: { icon: "/favicon.ico" },
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
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
