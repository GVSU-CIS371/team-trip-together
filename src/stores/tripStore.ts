import { defineStore } from "pinia";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Activity, Expense, PackingItem, Trip } from "../types";

type TripState = {
  trips: Trip[];
  activities: Activity[];
  expenses: Expense[];
  packingItems: PackingItem[];
  selectedTripId: string;
  errorMessage: string;
};

export const useTripStore = defineStore("tripStore", {
  state: (): TripState => ({
    trips: [],
    activities: [],
    expenses: [],
    packingItems: [],
    selectedTripId: "",
    errorMessage: "",
  }),

  getters: {
    selectedTrip: (state) => {
      return state.trips.find((trip) => trip.id === state.selectedTripId) || null;
    },

    selectedTripActivities: (state) => {
      return state.activities.filter((activity) => activity.tripId === state.selectedTripId);
    },

    selectedTripExpenses: (state) => {
      return state.expenses.filter((expense) => expense.tripId === state.selectedTripId);
    },

    selectedTripPackingItems: (state) => {
      return state.packingItems.filter((item) => item.tripId === state.selectedTripId);
    },

    totalExpensesForSelectedTrip: (state) => {
      return state.expenses
        .filter((expense) => expense.tripId === state.selectedTripId)
        .reduce((total, expense) => total + expense.amount, 0);
    },
  },

  actions: {
    selectTrip(tripId: string) {
      this.selectedTripId = tripId;
    },

    listenForTrips(userId: string) {
      const tripsQuery = query(
  collection(db, "trips"),
  where("members", "array-contains", userId)
);

      onSnapshot(tripsQuery, (snapshot) => {
        this.trips = snapshot.docs.map((tripDoc) => ({
          id: tripDoc.id,
          ...tripDoc.data(),
        })) as Trip[];

        if (!this.selectedTripId && this.trips.length > 0) {
          this.selectedTripId = this.trips[0].id;
        }
      });
    },

    listenForActivities() {
      const activitiesQuery = query(collection(db, "activities"), orderBy("date", "asc"));

      onSnapshot(activitiesQuery, (snapshot) => {
        this.activities = snapshot.docs.map((activityDoc) => ({
          id: activityDoc.id,
          ...activityDoc.data(),
        })) as Activity[];
      });
    },

    listenForExpenses() {
      const expensesQuery = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

      onSnapshot(expensesQuery, (snapshot) => {
        this.expenses = snapshot.docs.map((expenseDoc) => ({
          id: expenseDoc.id,
          ...expenseDoc.data(),
        })) as Expense[];
      });
    },

    listenForPackingItems(userId: string) {
      const packingQuery = query(
        collection(db, "packingLists"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      onSnapshot(packingQuery, (snapshot) => {
        this.packingItems = snapshot.docs.map((packingDoc) => ({
          id: packingDoc.id,
          ...packingDoc.data(),
        })) as PackingItem[];
      });
    },

    async addTrip(payload: {
      tripName: string;
      destination: string;
      startDate: string;
      endDate: string;
      ownerId: string;
    }) {
      await addDoc(collection(db, "trips"), {
        tripName: payload.tripName,
        destination: payload.destination,
        startDate: payload.startDate,
        endDate: payload.endDate,
        ownerId: payload.ownerId,
        members: [payload.ownerId],
        createdAt: new Date().toISOString(),
      });
    },

    async updateTrip(trip: Trip) {
      const tripRef = doc(db, "trips", trip.id);
      await updateDoc(tripRef, {
        tripName: trip.tripName,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
      });
    },

    async deleteTrip(tripId: string) {
      await deleteDoc(doc(db, "trips", tripId));
      if (this.selectedTripId === tripId) {
        this.selectedTripId = this.trips[0]?.id || "";
      }
    },

    async inviteUserToTrip(tripId: string, userId: string) {
      const trip = this.trips.find((item) => item.id === tripId);
      if (!trip) return;

      const updatedMembers = Array.from(new Set([...trip.members, userId]));
      await updateDoc(doc(db, "trips", tripId), {
        members: updatedMembers,
      });
    },

    async addActivity(payload: Omit<Activity, "id" | "createdAt">) {
      await addDoc(collection(db, "activities"), {
        ...payload,
        createdAt: new Date().toISOString(),
      });
    },

    async updateActivity(activity: Activity) {
      await updateDoc(doc(db, "activities", activity.id), {
        title: activity.title,
        location: activity.location,
        date: activity.date,
        time: activity.time,
        notes: activity.notes,
      });
    },

    async deleteActivity(activityId: string) {
      await deleteDoc(doc(db, "activities", activityId));
    },

    async addExpense(payload: Omit<Expense, "id" | "createdAt">) {
      await addDoc(collection(db, "expenses"), {
        ...payload,
        createdAt: new Date().toISOString(),
      });
    },

    async updateExpense(expense: Expense) {
      await updateDoc(doc(db, "expenses", expense.id), {
        title: expense.title,
        amount: expense.amount,
        paidBy: expense.paidBy,
        splitBetween: expense.splitBetween,
      });
    },

    async deleteExpense(expenseId: string) {
      await deleteDoc(doc(db, "expenses", expenseId));
    },

    async addPackingItem(payload: {
      userId: string;
      tripId: string;
      itemName: string;
    }) {
      await addDoc(collection(db, "packingLists"), {
        ...payload,
        packedStatus: false,
        createdAt: new Date().toISOString(),
      });
    },

    async togglePackingItem(item: PackingItem) {
      await updateDoc(doc(db, "packingLists", item.id), {
        packedStatus: !item.packedStatus,
      });
    },

    async deletePackingItem(itemId: string) {
      await deleteDoc(doc(db, "packingLists", itemId));
    },
  },
});
