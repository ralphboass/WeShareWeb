import type { Metadata } from "next";
import { Car, Gift, Ticket } from "lucide-react";
import { AppStoreButton } from "@/components/StoreBadges";
import { Card, Panel } from "@/components/ui";

export const metadata: Metadata = {
  title: "You've been invited",
  description:
    "Join WeShare Ride with a friend's invite code and get $5 off your first ride.",
};

/**
 * Landing page for https://weshare-ride.com/invite/<CODE>.
 *
 * On an iPhone with the app installed this URL is claimed as a universal link and
 * never reaches the web — iOS hands the code straight to the app. This page is the
 * fallback for everyone else: it shows the code so it can be typed in at signup.
 */
export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const inviteCode = decodeURIComponent(code).toUpperCase().slice(0, 16);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16">
      <Card className="text-center">
        <Gift className="mx-auto size-12 text-brand-600" />

        <h1 className="mt-4 text-2xl font-bold text-ink">
          A friend invited you to WeShare
        </h1>
        <p className="mt-2 text-ink-soft">
          Sign up with their code and get <strong>$5 off</strong> your first ride
          of $15 or more.
        </p>

        <Panel className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Invite code
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-widest text-ink">
            {inviteCode}
          </p>
        </Panel>

        <div className="mt-6 flex justify-center">
          <AppStoreButton />
        </div>

        <div className="mt-8 space-y-3 text-left">
          <div className="flex gap-3">
            <Ticket className="mt-0.5 size-5 shrink-0 text-brand-600" />
            <p className="text-sm text-ink-soft">
              Invite rewards are issued when you sign up in the iOS app — enter
              the code in the <strong>Invite Code</strong> field and your voucher
              is applied automatically.
            </p>
          </div>
          <div className="flex gap-3">
            <Car className="mt-0.5 size-5 shrink-0 text-brand-600" />
            <p className="text-sm text-ink-soft">
              Once you complete your first ride, your friend receives reward
              credits too.
            </p>
          </div>
        </div>
      </Card>
    </main>
  );
}
