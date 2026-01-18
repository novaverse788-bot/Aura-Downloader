import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDmnNCsayvRr8V1VtdZhNOwpmophh-zSgk",
  authDomain: "aura-tube-1b8d9.firebaseapp.com",
  databaseURL: "https://aura-tube-1b8d9-default-rtdb.firebaseio.com",
  projectId: "aura-tube-1b8d9",
  storageBucket: "aura-tube-1b8d9.firebasestorage.app",
  messagingSenderId: "603770152512",
  appId: "1:603770152512:web:c2ced59e386e70e17ce1a5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

// Helper to check if Firebase is configured
export const isFirebaseConfigured = () => {
    return true;
};