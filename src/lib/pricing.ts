/**
 * Pricing rules copied from the iOS app so the web charges exactly the same.
 * See BookRideView.swift (passenger side) and BookingService.swift (fees).
 */

export const PASSENGER_SERVICE_FEE_RATE = 0.05;
export const PLATFORM_FEE_RATE = 0.05;
export const PROCESSING_FEE_RATE = 0.03;
export const FIXED_TRANSACTION_FEE = 0.5;

const round2 = (value: number) => Math.round(value * 100) / 100;

export interface PriceBreakdown {
  subtotal: number;
  serviceFee: number;
  creditDiscount: number;
  voucherDiscount: number;
  total: number;
}

export function priceBreakdown({
  pricePerSeat,
  seats,
  creditsToRedeem = 0,
  voucherDiscount = 0,
}: {
  pricePerSeat: number;
  seats: number;
  creditsToRedeem?: number;
  voucherDiscount?: number;
}): PriceBreakdown {
  const subtotal = round2(pricePerSeat * seats);
  const serviceFee = round2(subtotal * PASSENGER_SERVICE_FEE_RATE);
  // 100 credits = $1.00, same as RewardCreditsService.redeemCredits
  const creditDiscount = round2(creditsToRedeem / 100);
  const total = Math.max(
    0,
    round2(subtotal + serviceFee - creditDiscount - voucherDiscount),
  );
  return { subtotal, serviceFee, creditDiscount, voucherDiscount, total };
}

/** What the driver nets after platform, processing and fixed fees. */
export function driverEarnings(passengerPayment: number): number {
  const fees =
    passengerPayment * PLATFORM_FEE_RATE +
    passengerPayment * PROCESSING_FEE_RATE +
    FIXED_TRANSACTION_FEE;
  return Math.max(0, round2(passengerPayment - fees));
}

export const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );
