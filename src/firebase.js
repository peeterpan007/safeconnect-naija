// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAN4rkr84ZTDiZzXrguNfatyU2H9Icjoyc", 
  authDomain: "safeconnectnaija.firebaseapp.com", 
  projectId: "safeconnectnaija",
  storageBucket: "safeconnectnaija.firebasestorage.app",
  messagingSenderId: "551611887104", 
  appId: "1:551611887104:web:42da44534f3c616febf2e5", 
  measurementId: "G-D75MKP0WC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// ✅ Add and export providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, analytics, auth, googleProvider, facebookProvider };