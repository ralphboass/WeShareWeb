import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";

/**
 * Email verification, matching the iOS app exactly
 * (FirebaseService.sendEmailVerification / verifyEmailCode).
 *
 * A 6-digit code is stored at `emailVerifications/{email}` and the email is
 * queued in the `mail` collection, which the Firebase Trigger Email extension
 * delivers. Codes generated on the web are therefore accepted by the app and
 * vice versa.
 */

const CODE_TTL_MS = 60 * 60 * 1000; // 1 hour, same as the app

/** Cryptographically random 6-digit code, zero-padded like the app's format. */
function generateCode(): string {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return String(buffer[0] % 1_000_000).padStart(6, "0");
}

function emailHtml(code: string): string {
  return `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #007AFF; margin: 0;">WeShare</h1>
                        </div>
                        <h2 style="color: #333;">Verify Your Email Address</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">
                            Welcome to WeShare! Please verify your email address to complete your registration.
                        </p>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">
                            Enter this verification code to finish signing up:
                        </p>
                        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <div style="font-size: 36px; font-weight: bold; color: #007AFF; letter-spacing: 8px;">
                                ${code}
                            </div>
                        </div>
                        <p style="color: #666; font-size: 14px; line-height: 1.5;">
                            This code will expire in <strong>1 hour</strong>.
                        </p>
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            If you didn't create an account with WeShare, you can safely ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            WeShare - Your Ride Sharing App
                        </p>
                    </div>`;
}

function emailText(code: string): string {
  return `Verify Your Email Address - WeShare

Welcome to WeShare! Please verify your email address to complete your registration.

Enter this verification code to finish signing up:

${code}

This code will expire in 1 hour.

If you didn't create an account with WeShare, you can safely ignore this email.

WeShare - Your Ride Sharing App`;
}

/** Creates a fresh code and queues the verification email. */
export async function sendVerificationCode(email: string): Promise<void> {
  const db = getDb();
  const cleanEmail = email.trim();
  const code = generateCode();

  // Document id is the email address, so re-sending replaces the previous code
  // and resets `verified` — identical to the app's setData behaviour.
  await setDoc(doc(db, "emailVerifications", cleanEmail), {
    email: cleanEmail,
    code,
    createdAt: Timestamp.fromDate(new Date()),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + CODE_TTL_MS)),
    verified: false,
  });

  await addDoc(collection(db, "mail"), {
    to: [cleanEmail],
    message: {
      subject: "Verify Your Email - WeShare",
      html: emailHtml(code),
      text: emailText(code),
    },
  });
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "no-code" | "mismatch" | "used" | "expired" };

/**
 * Checks a code and, on success, flips `emailVerified` on the user document —
 * which is what both the app and the website gate access on.
 */
export async function verifyEmailCode(
  email: string,
  code: string,
  userId: string,
): Promise<VerifyResult> {
  const db = getDb();
  const cleanEmail = email.trim();
  const ref = doc(db, "emailVerifications", cleanEmail);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return { ok: false, reason: "no-code" };

  const data = snapshot.data() as {
    code?: string;
    verified?: boolean;
    expiresAt?: Timestamp;
  };

  if (data.code !== code.trim()) return { ok: false, reason: "mismatch" };
  if (data.verified) return { ok: false, reason: "used" };

  const expiresAt = data.expiresAt?.toDate();
  if (!expiresAt || new Date() >= expiresAt) {
    return { ok: false, reason: "expired" };
  }

  await updateDoc(ref, { verified: true });
  await updateDoc(doc(db, "users", userId), {
    emailVerified: true,
    updatedAt: Timestamp.fromDate(new Date()),
  });

  return { ok: true };
}
