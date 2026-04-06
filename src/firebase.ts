import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use environment variables for secure production config.
// These should be set in Netlify Environment Variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate required environment variables to prevent runtime crashes.
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.toUpperCase()}`);

if (missingKeys.length > 0) {
  console.error(
    `[Firebase] CRITICAL: Missing environment variables: ${missingKeys.join(', ')}. ` +
    `Ensure these are set in your Netlify dashboard with the VITE_ prefix.`
  );
}

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('[Firebase] Initialization failed:', error);
}

export const auth = getAuth(app!);
export const db = getFirestore(app!);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, onAuthStateChanged };

