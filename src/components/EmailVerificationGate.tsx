"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MailCheck } from "lucide-react";
import { Alert, Button, Card, Field, inputClass } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { sendVerificationCode, verifyEmailCode } from "@/lib/verification";

/**
 * Blocks the site for signed-in accounts whose email isn't verified yet,
 * mirroring MainView in the iOS app: authenticated but `emailVerified == false`
 * shows the verification screen instead of the app.
 *
 * Signed-out visitors are unaffected, so the marketing pages and ride browsing
 * stay public. Accounts created before verification existed have no
 * `emailVerified` field, and — as in the app — only an explicit `false` gates
 * them, so they are never locked out.
 */
export function EmailVerificationGate({ children }: { children: ReactNode }) {
  const { firebaseUser, profile, loading } = useAuth();

  const needsVerification =
    !loading && !!firebaseUser && profile?.emailVerified === false;

  if (!needsVerification) return <>{children}</>;

  return (
    <VerifyEmailScreen email={profile?.email ?? firebaseUser?.email ?? ""} />
  );
}

function VerifyEmailScreen({ email }: { email: string }) {
  const { firebaseUser, logOut } = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  // The code is sent by the sign-up flow. A user who reloads or signs in again
  // while unverified would otherwise be stuck with no way forward, so send one
  // on first mount when arriving here cold.
  const requested = useRef(false);
  useEffect(() => {
    if (requested.current || !email) return;
    requested.current = true;
    if (sessionStorage.getItem(`weshare:code-sent:${email}`)) return;
    sessionStorage.setItem(`weshare:code-sent:${email}`, "1");
    sendVerificationCode(email).catch(() => {
      setError(
        "We couldn't send your verification email. Use “Resend code” to try again.",
      );
    });
  }, [email]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!firebaseUser) return;

    setError(null);
    setNotice(null);
    setVerifying(true);
    try {
      const result = await verifyEmailCode(email, code, firebaseUser.uid);
      if (result.ok) {
        // The profile listener picks up emailVerified and this gate unmounts.
        setNotice("Email verified. Loading your account…");
        return;
      }
      setError(
        {
          "no-code":
            "We couldn't find a code for this address. Request a new one.",
          mismatch: "That code isn't right. Check the email and try again.",
          used: "That code was already used. Request a new one.",
          expired: "That code has expired. Request a new one.",
        }[result.reason],
      );
    } catch {
      setError("Something went wrong verifying your code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setNotice(null);
    setResending(true);
    try {
      await sendVerificationCode(email);
      setNotice(`We sent a new code to ${email}.`);
    } catch {
      setError("We couldn't resend the code. Please try again in a moment.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="hero-gradient min-h-[80vh]">
      <div className="mx-auto max-w-md px-5 py-16">
        <Card>
          <div className="text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <MailCheck className="size-7" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold text-brand-600">{email}</p>
          </div>

          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            {error && <Alert tone="error">{error}</Alert>}
            {notice && <Alert tone="info">{notice}</Alert>}

            <Field label="Verification code">
              <input
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="123456"
                className={`${inputClass} text-center text-2xl font-bold tracking-[0.4em]`}
              />
            </Field>

            <Button
              type="submit"
              loading={verifying}
              disabled={code.length !== 6}
              className="w-full"
            >
              Verify email
            </Button>
          </form>

          <div className="mt-5 space-y-3 text-center text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-60"
            >
              {resending ? "Sending…" : "Didn't get it? Resend code"}
            </button>
            <p className="text-ink-muted">
              Wrong address?{" "}
              <button
                type="button"
                onClick={() => logOut()}
                className="font-semibold text-red-600 hover:text-red-700"
              >
                Sign out
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
