"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, GraduationCap } from "lucide-react";
import { Alert, Button, Card, Field, cx, inputClass } from "@/components/ui";
import { Wordmark } from "@/components/Wordmark";
import { useAuth } from "@/contexts/AuthContext";
import { campusFromEmail, isStudentEmail } from "@/lib/users";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    "An account already exists with that email. Try signing in instead.",
  "auth/weak-password": "Pick a stronger password — at least 8 characters.",
  "auth/invalid-email": "Enter a valid email address.",
};

function messageFor(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return (
    ERROR_MESSAGES[code] ?? "We couldn't create your account. Please try again."
  );
}

type Strength = "empty" | "weak" | "fair" | "strong";

/** Mirrors PasswordStrengthIndicator in the iOS app. */
function passwordStrength(password: string): Strength {
  if (!password) return "empty";
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  if (checks <= 1) return "weak";
  if (checks <= 3) return "fair";
  return "strong";
}

const STRENGTH_META: Record<
  Exclude<Strength, "empty">,
  { label: string; bar: string; text: string; filled: number }
> = {
  weak: { label: "Weak", bar: "bg-red-500", text: "text-red-600", filled: 1 },
  fair: {
    label: "Fair",
    bar: "bg-accent-yellow",
    text: "text-yellow-700",
    filled: 2,
  },
  strong: {
    label: "Strong",
    bar: "bg-emerald-500",
    text: "text-emerald-600",
    filled: 3,
  },
};

function PasswordStrength({ password }: { password: string }) {
  const strength = passwordStrength(password);
  if (strength === "empty") return null;
  const meta = STRENGTH_META[strength];
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cx(
              "h-1.5 flex-1 rounded-full",
              index < meta.filled ? meta.bar : "bg-neutral-200",
            )}
          />
        ))}
      </div>
      <p className={cx("mt-1 text-xs font-semibold", meta.text)}>
        {meta.label} password
      </p>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp, configured } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const campus = useMemo(
    () => (isStudentEmail(email) ? campusFromEmail(email) : null),
    [email],
  );
  const studentEmail = isStudentEmail(email);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim()
    ) {
      setError("Please fill in every field.");
      return;
    }
    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signUp({ email, password, firstName, lastName, phoneNumber });
      router.push("/rides");
    } catch (submitError) {
      setError(messageFor(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="hero-gradient">
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="mb-8 text-center">
          <Wordmark className="text-2xl" />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Join students sharing rides across Los Angeles.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!configured && (
              <Alert tone="info">
                Accounts are unavailable until Firebase is configured for this
                deployment.
              </Alert>
            )}
            {error && <Alert tone="error">{error}</Alert>}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input
                  autoComplete="given-name"
                  required
                  disabled={!configured}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Alex"
                  className={inputClass}
                />
              </Field>
              <Field label="Last name">
                <input
                  autoComplete="family-name"
                  required
                  disabled={!configured}
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Nguyen"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Email">
              <input
                type="email"
                autoComplete="email"
                required
                disabled={!configured}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@ucla.edu"
                className={inputClass}
              />
            </Field>

            {studentEmail && (
              <p className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <GraduationCap className="mt-0.5 size-4 shrink-0" />
                {campus
                  ? `${campus} email detected — you'll be marked as a verified student.`
                  : "Student email detected — you'll be marked as a verified student."}
              </p>
            )}

            <Field label="Phone number">
              <input
                type="tel"
                autoComplete="tel"
                required
                disabled={!configured}
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="(310) 555-0142"
                className={inputClass}
              />
            </Field>

            <Field label="Password" hint="At least 8 characters.">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  disabled={!configured}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-ink-muted transition hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              <PasswordStrength password={password} />
            </Field>

            <Field label="Confirm password">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                disabled={!configured}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                className={inputClass}
              />
              {confirmPassword.length > 0 && confirmPassword === password && (
                <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <Check className="size-3.5" />
                  Passwords match
                </span>
              )}
            </Field>

            <label className="flex items-start gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={acceptedTerms}
                disabled={!configured}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 size-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-200"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <Button
              type="submit"
              loading={submitting}
              disabled={!configured}
              className="w-full"
            >
              Create account
            </Button>

            <p className="text-center text-sm text-ink-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
