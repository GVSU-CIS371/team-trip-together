import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIZNMOaypeVFlwdN2AM4MfmJKrrWlo7qI",
  authDomain: "trip-together-409a7.firebaseapp.com",
  projectId: "trip-together-409a7",
  storageBucket: "trip-together-409a7.firebasestorage.app",
  messagingSenderId: "963019845095",
  appId: "1:963019845095:web:4b6b18246d14588c676142"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
