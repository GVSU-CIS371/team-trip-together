<script setup lang="ts">
import { ref } from "vue";
import { useTripStore } from "../stores/tripStore";
import type { Trip } from "../types";

const tripStore = useTripStore();

const editingTripId = ref("");
const inviteUserId = ref("");

function startEditing(trip: Trip) {
  editingTripId.value = trip.id;
}

async function saveTrip(trip: Trip) {
  await tripStore.updateTrip(trip);
  editingTripId.value = "";
}

async function inviteSelectedUser() {
  if (!tripStore.selectedTripId || !inviteUserId.value) return;
  await tripStore.inviteUserToTrip(tripStore.selectedTripId, inviteUserId.value);
  inviteUserId.value = "";
}
</script>

<template>
  <section class="card">
    <h2>Your Trips</h2>

    <div v-if="tripStore.trips.length === 0" class="muted">
      No trips yet.
    </div>

    <div class="trip-list">
      <article
        v-for="trip in tripStore.trips"
        :key="trip.id"
        class="trip-item"
        :class="{ selected: trip.id === tripStore.selectedTripId }"
      >
        <button class="trip-select" @click="tripStore.selectTrip(trip.id)">
          <strong>{{ trip.tripName }}</strong>
          <span>{{ trip.destination }}</span>
        </button>

        <div v-if="editingTripId === trip.id" class="form-grid compact">
          <input v-model="trip.tripName" />
          <input v-model="trip.destination" />
          <input v-model="trip.startDate" type="date" />
          <input v-model="trip.endDate" type="date" />
          <button class="primary-button" @click="saveTrip(trip)">Save</button>
        </div>

        <div class="row-actions">
          <button class="small-button" @click="startEditing(trip)">Edit</button>
          <button class="danger-button" @click="tripStore.deleteTrip(trip.id)">Delete</button>
        </div>
      </article>
    </div>

    <div v-if="tripStore.selectedTrip" class="invite-box">
      <h3>Invite by user ID</h3>
      <p class="muted">For the class demo, copy another user's Firebase UID and add it here.</p>
      <input v-model="inviteUserId" placeholder="User ID" />
      <button class="secondary-button full-width" @click="inviteSelectedUser">Invite User</button>
    </div>
  </section>
</template>
