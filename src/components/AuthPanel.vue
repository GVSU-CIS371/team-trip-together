<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const isRegistering = ref(false);

async function submitAuthForm() {
  if (isRegistering.value) {
    await authStore.register(email.value, password.value);
  } else {
    await authStore.login(email.value, password.value);
  }
}
</script>

<template>
  <section class="auth-card card">
    <h2>{{ isRegistering ? "Create an account" : "Log in" }}</h2>
    <p>Use email and password or Google sign in.</p>

    <form @submit.prevent="submitAuthForm" class="form-grid">
      <label>
        Email
        <input v-model="email" type="email" required placeholder="you@example.com" />
      </label>

      <label>
        Password
        <input v-model="password" type="password" required placeholder="Password" />
      </label>

      <button class="primary-button" type="submit">
        {{ isRegistering ? "Register" : "Log in" }}
      </button>
    </form>

    <button class="secondary-button full-width" @click="authStore.loginWithGoogle">
      Continue with Google
    </button>

    <button class="link-button" @click="isRegistering = !isRegistering">
      {{ isRegistering ? "Already have an account? Log in" : "Need an account? Register" }}
    </button>

    <p v-if="authStore.errorMessage" class="error">{{ authStore.errorMessage }}</p>
  </section>
</template>
