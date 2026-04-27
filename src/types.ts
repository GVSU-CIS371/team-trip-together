export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
};

export type Trip = {
  id: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  ownerId: string;
  members: string[];
  createdAt: string;
};

export type Activity = {
  id: string;
  tripId: string;
  title: string;
  location: string;
  date: string;
  time: string;
  notes: string;
  createdBy: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  createdAt: string;
};

export type PackingItem = {
  id: string;
  userId: string;
  tripId: string;
  itemName: string;
  packedStatus: boolean;
  createdAt: string;
};
