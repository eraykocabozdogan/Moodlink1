# Moodlink

Frontend of **Moodlink**, a mood-centric social network where users share posts
tagged with how they feel, track their mood over time, and connect with people based
on emotional compatibility.

> Team project, May–June 2025: two frontend developers working against a separate
> backend team's REST API.
> I wrote 49 of the 76 commits. I owned the backend integration: authentication,
> posts, comments and likes, profile, mood report, and messaging.

## Features

- **Auth flow:** sign-up, email verification, login and forgot-password screens,
  with token-based sessions handled by an Axios API client and an auth hook.
- **Feed:** posts with mood tags, comments, likes, and photo viewing.
- **Mood report:** charts of a user's mood distribution and history (Recharts), plus
  mood-compatibility scores between users on profiles, posts and suggestions.
- **Messaging:** one-to-one and group chats with near-real-time updates
  (incremental polling by last message ID).
- **Profiles:** profile-picture upload through the backend's file-attachment API,
  user search, notifications, activities and communities.
- **Theming:** multiple color themes with persistent selection.

## Tech

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui (Radix) ·
React Hook Form + Zod · Axios · Recharts. The REST contract is in
[`swagger.json`](swagger.json).

## Run

```bash
npm ci --legacy-peer-deps   # react-day-picker 8 declares an older date-fns peer
npm run dev                 # or: npm run build && npm start
```

The app expects the Moodlink REST backend. The original Render deployment
(`moodlinkbackend.onrender.com`) is no longer online, so data-driven screens need a
compatible backend that implements `swagger.json`.

The paper-prototype design report is in [`PaperRapor_G2.pdf`](PaperRapor_G2.pdf).
