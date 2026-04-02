import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhE7Y4VfNpyeEte5XeN7NpI2KCKpdmnsI",
  authDomain: "autopilotx-489904.firebaseapp.com",
  projectId: "autopilotx-489904",
  storageBucket: "autopilotx-489904.firebasestorage.app",
  messagingSenderId: "674664064455",
  appId: "1:674664064455:web:6ee280b7c17756ec51a5e2",
  measurementId: "G-W21FFSTS9P"
};

// Initialize Firebase (prevent multiple initializations in Next.js development)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics conditionally (only runs in browser, not during SSR)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics };
