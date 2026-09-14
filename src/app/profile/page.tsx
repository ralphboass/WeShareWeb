"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  BadgeCheck,
  Car,
  GraduationCap,
  LogOut,
  MessageCircle,
  Route,
  Star,
  Ticket,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, campusFromEmail } from "@/lib/users";
import { fullName } from "@/lib/types";
import { formatMemberSince } from "@/lib/format";
import { formatMoney } from "@/lib/pricing";
import { isFirebaseConfigured } from "@/lib/firebase";
import { APP_STORE_URL } from "@/components/Footer";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonLink,
  Card,
  Field,
  Panel,
  Spinner,
  inputClass,
} from "@/components/ui";

interface FormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  biography: string;
}

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
  biography: "",
};

export default function ProfilePage() {
  const { firebaseUser, profile, loading, logOut } = useAuth();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<
    { tone: "success" | "error"; message: string } | null
  >(null);
  const [signingOut, setSigningOut] = useState(false);

  // Seed the form once the live profile snapshot arrives (and whenever the
  // signed-in user changes), but never while the user is mid-edit.
  useEffect(() => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      address: profile.address ?? "",
      biography: profile.biography ?? "",
    });
  }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Spinner label="Loading your profile…" />
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Card className="mx-auto max-w-md text-center">
          <h1 className="text-xl font-bold text-ink">Sign in to WeShare</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Your profile, trips and messages live behind your student account.
          </p>
          <ButtonLink href="/login?next=/profile" className="mt-5 w-full">
            Log in
          </ButtonLink>
        </Card>
      </div>
    );
  }

  const name = profile ? fullName(profile) : (firebaseUser.displayName ?? "");
  const email = profile?.email ?? firebaseUser.email ?? "";
  const campus = email ? campusFromEmail(email) : null;

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isFirebaseConfigured) return;
    setSaving(true);
    setStatus(null);
    try {
      await updateProfile(firebaseUser.uid, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        biography: form.biography.trim(),
      });
      setStatus({ tone: "success", message: "Your details were saved." });
    } catch (error) {
      setStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not save your details. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      {!isFirebaseConfigured && (
        <div className="mb-6">
          <Alert tone="warning">
            Demo mode: Firebase is not configured, so profile data cannot be
            loaded or saved.
          </Alert>
        </div>
      )}

      <Card className="app-gradient border-transparent">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar name={name} imageUrl={profile?.profileImageUrl} size={96} />
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-ink">
              {name || "Your profile"}
            </h1>
            <p className="mt-1 text-sm break-all text-ink-soft">{email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {profile?.uclaVerified && (
                <Badge tone="green">
                  <BadgeCheck className="size-4" />
                  Verified student
                </Badge>
              )}
              {campus && (
                <Badge tone="brand">
                  <GraduationCap className="size-4" />
                  {campus}
                </Badge>
              )}
              {profile && (
                <Badge tone="neutral">
                  Member since {formatMemberSince(profile.createdAt)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<Route className="size-5" />}
          label="Trips"
          value={String(profile?.numberOfTrips ?? 0)}
        />
        <StatTile
          icon={<Wallet className="size-5" />}
          label="Wallet balance"
          value={formatMoney(profile?.walletBalance ?? 0)}
        />
        <StatTile
          icon={<Star className="size-5" />}
          label="Driver rating"
          value={
            profile?.driverRating != null
              ? profile.driverRating.toFixed(1)
              : "No ratings yet"
          }
          hint={
            profile?.driverRating != null
              ? `${profile.driverReviewCount ?? 0} review${
                  (profile.driverReviewCount ?? 0) === 1 ? "" : "s"
                }`
              : undefined
          }
        />
        <StatTile
          icon={<Star className="size-5" />}
          label="Passenger rating"
          value={
            profile?.passengerRating != null
              ? profile.passengerRating.toFixed(1)
              : "No ratings yet"
          }
          hint={
            profile?.passengerRating != null
              ? `${profile.passengerReviewCount ?? 0} review${
                  (profile.passengerReviewCount ?? 0) === 1 ? "" : "s"
                }`
              : undefined
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card>
          <h2 className="text-lg font-bold text-ink">Edit details</h2>
          <p className="mt-1 text-sm text-ink-muted">
            These details are shared with the drivers and passengers you ride
            with.
          </p>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input
                  className={inputClass}
                  value={form.firstName}
                  onChange={(event) =>
                    setForm({ ...form, firstName: event.target.value })
                  }
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Last name">
                <input
                  className={inputClass}
                  value={form.lastName}
                  onChange={(event) =>
                    setForm({ ...form, lastName: event.target.value })
                  }
                  autoComplete="family-name"
                />
              </Field>
            </div>

            <Field label="Phone number">
              <input
                className={inputClass}
                value={form.phoneNumber}
                onChange={(event) =>
                  setForm({ ...form, phoneNumber: event.target.value })
                }
                inputMode="tel"
                autoComplete="tel"
                placeholder="+1 310 555 0134"
              />
            </Field>

            <Field label="Address" hint="Only used to suggest pickup points.">
              <input
                className={inputClass}
                value={form.address}
                onChange={(event) =>
                  setForm({ ...form, address: event.target.value })
                }
                autoComplete="street-address"
              />
            </Field>

            <Field label="Short bio">
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={form.biography}
                onChange={(event) =>
                  setForm({ ...form, biography: event.target.value })
                }
                maxLength={280}
                placeholder="Third-year at UCLA, always down for a Westwood run."
              />
            </Field>

            {status && <Alert tone={status.tone}>{status.message}</Alert>}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" loading={saving} disabled={!isFirebaseConfigured}>
                Save changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStatus(null);
                  setForm(
                    profile
                      ? {
                          firstName: profile.firstName,
                          lastName: profile.lastName,
                          phoneNumber: profile.phoneNumber,
                          address: profile.address ?? "",
                          biography: profile.biography ?? "",
                        }
                      : emptyForm,
                  );
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-ink">Quick links</h2>
            <div className="mt-4 flex flex-col gap-3">
              <ButtonLink href="/bookings" variant="secondary">
                <Ticket className="size-4" />
                My trips
              </ButtonLink>
              <ButtonLink href="/rides/new" variant="secondary">
                <Car className="size-4" />
                Offer a ride
              </ButtonLink>
              <ButtonLink href="/messages" variant="secondary">
                <MessageCircle className="size-4" />
                Messages
              </ButtonLink>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink">Payments and payouts</h2>
            <Panel className="mt-4 text-sm text-ink-soft">
              Wallet top-ups, driver payouts and saved payment methods are
              managed in the WeShare iOS app. Your balance and trip history stay
              in sync across web and iOS.
            </Panel>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Open in the iOS app
            </a>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink">Account</h2>
            <p className="mt-1 text-sm text-ink-muted">
              You can sign back in any time with your student email.
            </p>
            <Button
              variant="danger"
              className="mt-4 w-full"
              loading={signingOut}
              onClick={async () => {
                setSigningOut(true);
                try {
                  await logOut();
                } finally {
                  setSigningOut(false);
                }
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-brand-600">
        {icon}
        <span className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
          {label}
        </span>
      </div>
      <p className="mt-3 text-xl font-extrabold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </Card>
  );
}
