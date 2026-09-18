"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import {
  createProfileDocument,
  isStudentEmail,
  subscribeToProfile,
} from "@/lib/users";
import { sendVerificationCode } from "@/lib/verification";
import type { UserProfile } from "@/lib/types";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
}

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(getFirebaseAuth(), (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      setProfile(null);
      return;
    }
    return subscribeToProfile(firebaseUser.uid, setProfile);
  }, [firebaseUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      loading,
      configured: isFirebaseConfigured,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(
          getFirebaseAuth(),
          email.trim(),
          password,
        );
      },
      signUp: async ({ email, password, firstName, lastName, phoneNumber }) => {
        const cleanEmail = email.trim();
        const credential = await createUserWithEmailAndPassword(
          getFirebaseAuth(),
          cleanEmail,
          password,
        );
        await updateAuthProfile(credential.user, {
          displayName: `${firstName} ${lastName}`.trim(),
        });
        await createProfileDocument({
          userId: credential.user.uid,
          email: cleanEmail,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.trim(),
          uclaVerified: isStudentEmail(cleanEmail),
        });

        // The profile is written with emailVerified: false, so the verification
        // gate takes over from here. As in the app, a failure to send the email
        // doesn't fail sign-up — the gate offers a resend.
        try {
          sessionStorage.setItem(`weshare:code-sent:${cleanEmail}`, "1");
          await sendVerificationCode(cleanEmail);
        } catch (error) {
          sessionStorage.removeItem(`weshare:code-sent:${cleanEmail}`);
          console.error("Failed to send verification email", error);
        }
      },
      resetPassword: async (email) => {
        await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
      },
      logOut: async () => {
        await signOut(getFirebaseAuth());
      },
    }),
    [firebaseUser, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
