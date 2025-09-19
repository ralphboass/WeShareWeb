// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://your-domain.com"; // TODO: update once deployed (e.g., Vercel URL)

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeShare – Share the ride, skip the traffic",
  description:
    "WeShare is a ride sharing app for Los Angeles. Match rides in minutes, save money, and beat traffic together.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WeShare – Share the ride, skip the traffic",
    description:
      "Ride sharing made simple in Los Angeles. Match rides in minutes and save on your commute.",
    url: siteUrl,
    siteName: "WeShare",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "WeShare – Share the ride, skip the traffic",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeShare – Share the ride, skip the traffic",
    description:
      "Ride sharing made simple in Los Angeles. Match rides in minutes and save on your commute.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
