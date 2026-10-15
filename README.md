# Last Catch Cup · LIVE scoreboard

Operation: Jason's Last Catch, a bachelor-party fishing comp (16–18 Oct 2026, NZ).

Open **https://berryb03.github.io/last-catch/** on your phone, pick your crew slot ("Who are you?"), and score away.
Every phone updates live. No signal? Entries queue on your phone and sync when you're back online.
Tip: use "Add to Home Screen" so it opens like an app.

- `index.html`: the whole app (single file, mobile-first)
- `sw.js`: offline cache so the page reloads without signal

Backend: a dedicated free Supabase project (`last-catch-cup`). The page uses the public publishable key, which can only
read the scoreboard, add score entries, mark entries undone and rename crew. It can't delete anything or edit points.
Reset is behind the organiser PIN.
