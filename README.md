# CareerUp

CareerUp is a gamified internship tracking website for students. The first prototype is a static web app with profile-based internship matching, application tracking, points, streaks, ranks, daily challenges, unlockable interview prep tools, and a friends leaderboard.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## What is included

- Resume and preference inputs that recalculate internship match scores.
- A live-postings-style feed using seeded internship data and freshness indicators.
- Application logging with point rewards and streak increases.
- Rank progression and next-rank progress.
- Daily challenges with claimable point rewards.
- Interview prep tools unlockable with points.
- Friends leaderboard with competitive scoring.

## Next build steps

- Replace seeded postings with a backend feed from APIs, scrapers, or partner sources.
- Add accounts, authentication, and durable cloud storage.
- Parse uploaded resumes into structured skills and preferences.
- Add real interview prep modules and point purchase flows.
- Add friend requests, teams, seasons, and anti-spam limits for points.
