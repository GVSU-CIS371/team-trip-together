import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../firebase/firebase";
import type { UserProfile } from "../types";

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  errorMessage: string;
};

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    user: null,
    profile: null,
    loading: true,
    errorMessage: "",
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
  },

  actions: {
    async createOrLoadProfile(user: User) {
      const userRef = doc(db, "users", user.uid);
      const existing = await getDoc(userRef);

      if (!existing.exists()) {
        const profile: UserProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email || "",
          createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, profile);
        this.profile = profile;
      } else {
        this.profile = existing.data() as UserProfile;
      }
    },

    listenForAuthChanges() {
      onAuthStateChanged(auth, async (currentUser) => {
        this.user = currentUser;
        if (currentUser) {
          await this.createOrLoadProfile(currentUser);
        } else {
          this.profile = null;
        }
        this.loading = false;
      });
    },

    async register(email: string, password: string) {
      this.errorMessage = "";
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await this.createOrLoadProfile(result.user);
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : "Registration failed.";
      }
    },

    async login(email: string, password: string) {
      this.errorMessage = "";
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await this.createOrLoadProfile(result.user);
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : "Login failed.";
      }
    },

    async loginWithGoogle() {
      this.errorMessage = "";
      try {
        const result = await signInWithPopup(auth, provider);
        await this.createOrLoadProfile(result.user);
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : "Google login failed.";
      }
    },

    async logout() {
      await signOut(auth);
      this.user = null;
      this.profile = null;
    },
  },
});
