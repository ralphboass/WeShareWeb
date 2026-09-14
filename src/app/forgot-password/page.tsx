"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Alert, Button, Card, Field, inputClass } from "@/components/ui";
import { Wordmark } from "@/components/Wordmark";
import { useAuth } from "@/contexts/AuthContext";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-not-found": "We couldn't find an account with that email.",
  "auth/too-many-requests":
    "Too many attempts. Wait a few minutes before trying again.",
};

function messageFor(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return (
    ERROR_MESSAGES[code] ?? "We couldn't send that email. Please try again."
  );
}

export default function ForgotPasswordPage() {
  const { resetPassword, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;
    setError(null);
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
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
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            We&apos;ll email you a link to choose a new one.
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            {!configured && (
              <Alert tone="info">
                Accounts are unavailable until Firebase is configured for this
                deployment.
              </Alert>
            )}

            {sent ? (
              <Alert tone="success">
                Check your inbox — we sent a password reset link to{" "}
                <strong>{email}</strong>. It can take a minute to arrive, and
                don&apos;t forget to look in your spam folder.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert tone="error">{error}</Alert>}
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
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={!configured}
                  className="w-full"
                >
                  Send reset link
                </Button>
              </form>
            )}

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
