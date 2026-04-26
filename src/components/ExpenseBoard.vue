<script setup lang="ts">
import { ref } from "vue";
import { useTripStore } from "../stores/tripStore";
import type { Expense } from "../types";

const props = defineProps<{
  userId: string;
}>();

const tripStore = useTripStore();

const title = ref("");
const amount = ref(0);
const editingExpenseId = ref("");

async function addExpense() {
  if (!tripStore.selectedTripId || !title.value || amount.value <= 0) return;

  await tripStore.addExpense({
    tripId: tripStore.selectedTripId,
    title: title.value,
    amount: Number(amount.value),
    paidBy: props.userId,
    splitBetween: tripStore.selectedTrip?.members || [props.userId],
  });

  title.value = "";
  amount.value = 0;
}

async function saveExpense(expense: Expense) {
  expense.amount = Number(expense.amount);
  await tripStore.updateExpense(expense);
  editingExpenseId.value = "";
}
</script>

<template>
  <section class="grid-two">
    <div class="card">
      <h2>Add Expense</h2>

      <form class="form-grid" @submit.prevent="addExpense">
        <label>
          Expense title
          <input v-model="title" required placeholder="Hotel" />
        </label>

        <label>
          Amount
          <input v-model.number="amount" type="number" min="0" step="0.01" required />
        </label>

        <button class="primary-button" type="submit">Add Expense</button>
      </form>
    </div>

    <div class="card">
      <h2>Shared Expenses</h2>

      <div class="total-box">
        Total: ${{ tripStore.totalExpensesForSelectedTrip.toFixed(2) }}
      </div>

      <article
        v-for="expense in tripStore.selectedTripExpenses"
        :key="expense.id"
        class="list-card"
      >
        <template v-if="editingExpenseId === expense.id">
          <input v-model="expense.title" />
          <input v-model.number="expense.amount" type="number" min="0" step="0.01" />
          <button class="primary-button" @click="saveExpense(expense)">Save</button>
        </template>

        <template v-else>
          <h3>{{ expense.title }}</h3>
          <p>${{ Number(expense.amount).toFixed(2) }}</p>
          <p class="muted">Split between {{ expense.splitBetween.length }} member(s)</p>
          <div class="row-actions">
            <button class="small-button" @click="editingExpenseId = expense.id">Edit</button>
            <button class="danger-button" @click="tripStore.deleteExpense(expense.id)">Delete</button>
          </div>
        </template>
      </article>
    </div>
  </section>
</template>
