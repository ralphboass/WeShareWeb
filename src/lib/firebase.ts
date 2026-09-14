import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFunctions, type Functions } from "firebase/functions";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

/**
 * When the Firebase env vars are absent (e.g. a fresh clone or a preview build
 * without secrets) the site still renders: read paths fall back to demo rides
 * and anything that writes shows a clear "not configured" message.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

function app(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables.",
    );
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const getFirebaseAuth = (): Auth => getAuth(app());
export const getDb = (): Firestore => getFirestore(app());
export const getFns = (): Functions => getFunctions(app(), "us-central1");
export const getBucket = (): FirebaseStorage => getStorage(app());
