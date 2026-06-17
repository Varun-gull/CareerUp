# CareerUp

CareerUp is a gamified internship application tracker for students. The MVP focuses on the core solo loop: track applications, mark roles as applied, earn XP, build streaks, level up through ranks, and complete simple challenges.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase client placeholder for authentication and database integration

## MVP Screens

- Home
- Sign up
- Log in
- Dashboard
- Applications
- Add application
- Profile
- Challenges
- Leaderboard

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Supabase Setup Later

Create `.env.local` when you have a Supabase project:

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

Then open Supabase SQL Editor and run:

```text
supabase/schema.sql
```

The app falls back to mock data until Supabase env vars are added.

## Live Postings

The `/postings` page uses Adzuna first when `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` are set. If those keys are missing or Adzuna returns no internship-style roles, it falls back to Remotive's public API, then sample postings.
