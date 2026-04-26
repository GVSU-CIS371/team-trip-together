<script setup lang="ts">
import { ref } from "vue";
import { useTripStore } from "../stores/tripStore";

const props = defineProps<{
  userId: string;
}>();

const tripStore = useTripStore();

const tripName = ref("");
const destination = ref("");
const startDate = ref("");
const endDate = ref("");

async function createTrip() {
  if (!tripName.value || !destination.value) return;

  await tripStore.addTrip({
    tripName: tripName.value,
    destination: destination.value,
    startDate: startDate.value,
    endDate: endDate.value,
    ownerId: props.userId,
  });

  tripName.value = "";
  destination.value = "";
  startDate.value = "";
  endDate.value = "";
}
</script>

<template>
  <section class="card">
    <h2>New Trip</h2>

    <form class="form-grid" @submit.prevent="createTrip">
      <label>
        Trip name
        <input v-model="tripName" required placeholder="Spring Break" />
      </label>

      <label>
        Destination
        <input v-model="destination" required placeholder="Chicago" />
      </label>

      <label>
        Start date
        <input v-model="startDate" type="date" />
      </label>

      <label>
        End date
        <input v-model="endDate" type="date" />
      </label>

      <button class="primary-button" type="submit">Create Trip</button>
    </form>
  </section>
</template>
