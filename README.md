# WeShare Web (weshare-ride.com)

The WeShare Ride website: marketing pages plus a working ride-sharing app —
search rides, log in, request a seat with card payment, offer rides, accept or
decline requests, chat, and manage your profile.

It talks to **the same Firebase project and Cloud Functions as the iOS app**
(`weshare-4ffbb`), so rides and bookings created here appear in the app and vice
versa.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Firebase JS SDK: Auth, Firestore, Cloud Functions callables, Storage
- Stripe.js + Payment Element (manual capture, via the existing
  `createPaymentIntent` Cloud Function)
- lucide-react icons, date-fns

## Getting started

```bash
npm install
cp env.example .env.local   # then fill in the values
npm run dev
```

Without `.env.local` the site still runs in **demo mode**: sample rides are
shown, and accounts/bookings are disabled with a visible banner.

### Required environment variables

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase console → Project settings → Your apps → **Web app** → SDK setup |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `weshare-4ffbb.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `weshare-4ffbb` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `weshare-4ffbb.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `276606156987` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Same web app SDK setup screen |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard (`pk_test_…` locally, `pk_live_…` in production) |

The iOS `GoogleService-Info.plist` values cannot be reused: a **Web** app has
its own API key and app ID. Register one under
Firebase console → Project settings → Your apps → Add app → Web.

### Firebase console checklist

1. **Add a Web app** to `weshare-4ffbb` and copy the config into the env vars.
2. **Authentication → Settings → Authorized domains**: add `localhost`,
   `weshare-ride.com`, `www.weshare-ride.com` and the `*.vercel.app` preview
   domain.
3. **Firestore rules** must let the website do what the app does. The pages
   assume:
   - `rides`: public read (the landing page and `/rides` work for logged-out
     visitors), create/update restricted to `riderId == request.auth.uid`.
   - `users`: read for signed-in users, create/update only for own document.
   - `bookings`: create when `passengerId == request.auth.uid`; read/update when
     the requester is `passengerId` **or** `driverId` (note: the field is
     `driverId`, not `riderId`).
   - `chats`: read/write when the requester is `senderId` or `receiverId`.
4. **Cloud Functions** used by the web app already exist and need no changes:
   `createPaymentIntent`, `updatePaymentIntentMetadata`, `cancelPaymentIntent`,
   `processRefund`. Capture and payouts keep running through
   `autoCapturePendingRides`.

## Deploying to Vercel

1. Push this folder to its own GitHub repo.
2. Import the repo in Vercel (framework preset: Next.js, no build overrides).
3. Add all `NEXT_PUBLIC_*` variables for Production, Preview and Development.
4. Add the domain `weshare-ride.com` in Vercel → Settings → Domains and follow
   the DNS instructions. Because the domain currently points at GitHub Pages
   (`WeShareWeb` repo, `CNAME` file), the existing A/CNAME records must be
   replaced with Vercel's before this site goes live.

## Payment flow

Identical to the iOS app, deliberately:

1. Passenger picks seats → `createPaymentIntent` is called with
   `captureMethod: "manual"` and the total (seat price × seats + 5% service fee).
2. Stripe Payment Element **authorizes** the card; the intent ends up in
   `requires_capture`.
3. The `bookings` document is written with `status: "pending"`,
   `paymentStatus: "pending"` and the `paymentIntentId`. Seats are **not**
   deducted yet.
4. `updatePaymentIntentMetadata` links the intent to the booking, and an intro
   message is posted to the driver's chat.
5. Driver accepts → booking becomes `confirmed` and `availableSeats` is
   decremented in a transaction.
6. Declining or cancelling releases the authorization (`cancelPaymentIntent`) or
   refunds a captured payment (`processRefund`). Cancellation is blocked inside
   2 hours of departure.
7. The scheduled `autoCapturePendingRides` function captures the payment and
   pays the driver after the ride is completed.

If the booking write fails after a successful authorization, the hold is
released automatically.

## Project structure

```
src/
  app/                  routes: /, /rides, /rides/[id], /rides/new, /bookings,
                        /messages, /profile, /login, /signup, /forgot-password,
                        /how-it-works, /privacy, /terms
  components/           Navbar, Footer, RideCard, RideSearchForm, RidesBrowser,
                        RideDetail, BookingDialog, UpcomingRides, ui primitives
  contexts/AuthContext  Firebase Auth state + profile snapshot
  lib/                  firebase, rides, bookings, payments, users, chat,
                        pricing, format, types, demo-data
```

`src/lib/types.ts`, `rides.ts` and `bookings.ts` mirror the Swift models and
`BookingService` exactly — field names must not drift, or the app and the site
will disagree.

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build (also type-checks)
npm run lint    # eslint
npx tsc --noEmit
```
