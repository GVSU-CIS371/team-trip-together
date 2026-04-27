<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "./stores/authStore";
import { useTripStore } from "./stores/tripStore";
import AuthPanel from "./components/AuthPanel.vue";
import TripForm from "./components/TripForm.vue";
import TripList from "./components/TripList.vue";
import ActivityBoard from "./components/ActivityBoard.vue";
import ExpenseBoard from "./components/ExpenseBoard.vue";
import PackingList from "./components/PackingList.vue";

const authStore = useAuthStore();
const tripStore = useTripStore();

const activeTab = ref<"activities" | "expenses" | "packing">("activities");

const userId = computed(() => authStore.user?.uid || "");

onMounted(() => {
  authStore.listenForAuthChanges();
});

watch(
  () => authStore.user,
  (user) => {
    if (user) {
      tripStore.listenForTrips(user.uid);
      tripStore.listenForActivities();
      tripStore.listenForExpenses();
      tripStore.listenForPackingItems(user.uid);
    }
  }
);
</script>

<template>
  <main>
    <section class="hero">
      <div>
        <p class="eyebrow">Collaborative Trip Planner</p>
        <h1>Trip Together</h1>
        <p class="subtitle">
          Create trips, plan activities, split expenses, and keep your own private packing list.
        </p>
      </div>

      <button v-if="authStore.isLoggedIn" class="secondary-button" @click="authStore.logout">
        Log out
      </button>
    </section>

    <div v-if="authStore.loading" class="card">
      Loading...
    </div>

    <AuthPanel v-else-if="!authStore.isLoggedIn" />

    <section v-else class="dashboard">
      <aside class="sidebar">
        <TripForm :user-id="userId" />
        <TripList />
      </aside>

      <section class="workspace">
        <div v-if="tripStore.selectedTrip" class="selected-trip card">
          <div>
            <p class="eyebrow">Current trip</p>
            <h2>{{ tripStore.selectedTrip.tripName }}</h2>
            <p>
              {{ tripStore.selectedTrip.destination }}
              <span v-if="tripStore.selectedTrip.startDate">
                • {{ tripStore.selectedTrip.startDate }} to {{ tripStore.selectedTrip.endDate }}
              </span>
            </p>
          </div>
        </div>

        <div v-if="!tripStore.selectedTrip" class="card empty-state">
          <h2>Create your first trip</h2>
          <p>After you create a trip, you can add shared activities, expenses, and private packing items.</p>
        </div>

        <template v-else>
          <nav class="tabs">
            <button :class="{ active: activeTab === 'activities' }" @click="activeTab = 'activities'">
              Shared Itinerary
            </button>
            <button :class="{ active: activeTab === 'expenses' }" @click="activeTab = 'expenses'">
              Shared Expenses
            </button>
            <button :class="{ active: activeTab === 'packing' }" @click="activeTab = 'packing'">
              My Packing List
            </button>
          </nav>

          <ActivityBoard v-if="activeTab === 'activities'" :user-id="userId" />
          <ExpenseBoard v-if="activeTab === 'expenses'" :user-id="userId" />
          <PackingList v-if="activeTab === 'packing'" :user-id="userId" />
        </template>
      </section>
    </section>
  </main>
</template>
