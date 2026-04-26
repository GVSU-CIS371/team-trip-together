<script setup lang="ts">
import { ref } from "vue";
import { useTripStore } from "../stores/tripStore";

const props = defineProps<{
  userId: string;
}>();

const tripStore = useTripStore();
const itemName = ref("");

async function addItem() {
  if (!itemName.value || !tripStore.selectedTripId) return;

  await tripStore.addPackingItem({
    userId: props.userId,
    tripId: tripStore.selectedTripId,
    itemName: itemName.value,
  });

  itemName.value = "";
}
</script>

<template>
  <section class="grid-two">
    <div class="card">
      <h2>Add Packing Item</h2>
      <p class="muted">This list is private. Only the logged in user can see their own items.</p>

      <form class="form-grid" @submit.prevent="addItem">
        <label>
          Item name
          <input v-model="itemName" required placeholder="Phone charger" />
        </label>

        <button class="primary-button" type="submit">Add Item</button>
      </form>
    </div>

    <div class="card">
      <h2>My Private Packing List</h2>

      <article
        v-for="item in tripStore.selectedTripPackingItems"
        :key="item.id"
        class="packing-item"
      >
        <label class="check-row">
          <input
            type="checkbox"
            :checked="item.packedStatus"
            @change="tripStore.togglePackingItem(item)"
          />
          <span :class="{ packed: item.packedStatus }">{{ item.itemName }}</span>
        </label>

        <button class="danger-button" @click="tripStore.deletePackingItem(item.id)">
          Delete
        </button>
      </article>
    </div>
  </section>
</template>
