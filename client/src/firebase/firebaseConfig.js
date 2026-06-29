import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForDeadlineAI2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "deadline-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "deadline-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "deadline-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef"
};

let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.warn("Firebase App failed to initialize with environment config:", e.message);
}

export { auth, googleProvider };
