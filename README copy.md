# PlanTogether

PlanTogether is a Vue 3 and Firebase web app for collaborative trip planning.

## Features

- Firebase login and logout
- Email and password authentication
- Google sign in
- Firestore database
- Shared trips
- Shared itinerary activities
- Shared expenses
- Private packing list items
- CRUD operations for trips, activities, expenses, and packing items
- Responsive design

## Firestore collections

- users
- trips
- activities
- expenses
- packingLists

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a Firebase project.

3. Enable Authentication.

Enable these sign in methods:

- Email and Password
- Google

4. Create a Cloud Firestore database.

5. Copy your Firebase web app config into:

```text
src/firebase/firebase.ts
```

6. Run the app locally.

```bash
npm run dev
```

7. Build the app.

```bash
npm run build
```

8. Deploy to GitHub Pages.

First update package.json and add your homepage if needed, then run:

```bash
npm run deploy
```

## Important Firebase rules for class testing

For quick development only, you can start with test mode rules. Before final submission, use safer rules that require authentication.

Example starter rules:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /trips/{tripId} {
      allow read, write: if request.auth != null;
    }

    match /activities/{activityId} {
      allow read, write: if request.auth != null;
    }

    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
    }

    match /packingLists/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Note about inviting users

The current starter app invites users by Firebase UID. This is simple for the class demo. A later improvement would be inviting users by email.
