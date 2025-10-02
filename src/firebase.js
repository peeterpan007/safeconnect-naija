// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔑 Firebase configuration (replace with your actual Firebase keys if not using .env)
const firebaseConfig = {
  apiKey: "AIzaSyAN4rkr84ZTDiZzXrguNfatyU2H9Icjoyc", 
  authDomain: "safeconnectnaija.firebaseapp.com", 
  projectId: "safeconnectnaija",
  storageBucket: "safeconnectnaija.appspot.com",   // ✅ fixed: must end with .appspot.com
  messagingSenderId: "551611887104",  
  appId: "1:551611887104:web:42da44534f3c616febf2e5",  
  measurementId: "G-D75MKP0WC4" 
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Providers (Google, Facebook, Phone)
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// ✅ Exports (auth, db, storage, providers, and phone utils)
export { 
  app, 
  auth, 
  db, 
  storage, 
  googleProvider, 
  facebookProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
};
