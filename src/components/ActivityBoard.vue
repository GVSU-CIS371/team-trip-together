<script setup lang="ts">
import { ref } from "vue";
import { useTripStore } from "../stores/tripStore";
import type { Activity } from "../types";

const props = defineProps<{
  userId: string;
}>();

const tripStore = useTripStore();

const title = ref("");
const location = ref("");
const date = ref("");
const time = ref("");
const notes = ref("");
const editingActivityId = ref("");

async function addActivity() {
  if (!tripStore.selectedTripId || !title.value) return;

  await tripStore.addActivity({
    tripId: tripStore.selectedTripId,
    title: title.value,
    location: location.value,
    date: date.value,
    time: time.value,
    notes: notes.value,
    createdBy: props.userId,
  });

  title.value = "";
  location.value = "";
  date.value = "";
  time.value = "";
  notes.value = "";
}

async function saveActivity(activity: Activity) {
  await tripStore.updateActivity(activity);
  editingActivityId.value = "";
}
</script>

<template>
  <section class="grid-two">
    <div class="card">
      <h2>Add Activity</h2>

      <form class="form-grid" @submit.prevent="addActivity">
        <label>
          Activity title
          <input v-model="title" required placeholder="Visit museum" />
        </label>

        <label>
          Location
          <input v-model="location" placeholder="Downtown" />
        </label>

        <label>
          Date
          <input v-model="date" type="date" />
        </label>

        <label>
          Time
          <input v-model="time" type="time" />
        </label>

        <label>
          Notes
          <textarea v-model="notes" placeholder="Tickets, reminders, etc."></textarea>
        </label>

        <button class="primary-button" type="submit">Add Activity</button>
      </form>
    </div>

    <div class="card">
      <h2>Shared Itinerary</h2>

      <article
        v-for="activity in tripStore.selectedTripActivities"
        :key="activity.id"
        class="list-card"
      >
        <template v-if="editingActivityId === activity.id">
          <input v-model="activity.title" />
          <input v-model="activity.location" />
          <input v-model="activity.date" type="date" />
          <input v-model="activity.time" type="time" />
          <textarea v-model="activity.notes"></textarea>
          <button class="primary-button" @click="saveActivity(activity)">Save</button>
        </template>

        <template v-else>
          <h3>{{ activity.title }}</h3>
          <p>{{ activity.location }}</p>
          <p class="muted">{{ activity.date }} {{ activity.time }}</p>
          <p>{{ activity.notes }}</p>
          <div class="row-actions">
            <button class="small-button" @click="editingActivityId = activity.id">Edit</button>
            <button class="danger-button" @click="tripStore.deleteActivity(activity.id)">Delete</button>
          </div>
        </template>
      </article>
    </div>
  </section>
</template>
