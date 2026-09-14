"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Alert, Button, Card, Field, Spinner, inputClass } from "@/components/ui";
import { Wordmark } from "@/components/Wordmark";
import { useAuth } from "@/contexts/AuthContext";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential":
    "That email and password don't match. Please try again.",
  "auth/user-not-found": "We couldn't find an account with that email.",
  "auth/wrong-password": "That password is incorrect.",
  "auth/too-many-requests":
    "Too many attempts. Wait a few minutes before trying again.",
  "auth/invalid-email": "Enter a valid email address.",
};

function messageFor(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, configured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.push(searchParams.get("next") ?? "/rides");
    } catch (submitError) {
      setError(messageFor(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!configured && (
        <Alert tone="info">
          Accounts are unavailable until Firebase is configured for this
          deployment.
        </Alert>
      )}
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

      <Field label="Password">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={!configured}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
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
      </Field>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        loading={submitting}
        disabled={!configured}
        className="w-full"
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-ink-muted">
        New to WeShare?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="hero-gradient">
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="mb-8 text-center">
          <Wordmark className="text-2xl" />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Sign in to book a seat or manage your rides.
          </p>
        </div>

        <Card>
          {/* useSearchParams needs a Suspense boundary for static prerendering. */}
          <Suspense fallback={<Spinner />}>
            <LoginForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
