import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCOxKDoUQvrj_zjVX-T7qABlGBYQEX3-PY",
  authDomain: "ms-tools-724b7.firebaseapp.com",
  projectId: "ms-tools-724b7",
  storageBucket: "ms-tools-724b7.firebasestorage.app",
  messagingSenderId: "731942457401",
  appId: "1:731942457401:web:6b6708ca2a65be76ccbde8",
  measurementId: "G-EK0KDFE012"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics and export it
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default app; 