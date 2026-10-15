# Last Catch · Operation: Jason's Last Catch (trip app v2)

Bachelor-party fishing weekend app (16–18 Oct 2026, upper Waitematā Harbour, NZ).

Open **https://berryb03.github.io/last-catch/** on your phone (or scan the QR code), pick your crew slot ("Who are you?") and score away. No login.
Tip: use "Add to Home Screen" so it opens like an app. After the first load everything works offline; scores sync when there's signal.

Tabs: 🏆 Scores (live Last Catch Cup) · 🗺️ Mission (timeline with NOW/NEXT, Jay's picks) · 🎣 Fish (windows, tides, go/no-go, spots, rules) · 🎒 Kit (checklist saved on each phone) · 🕵️ Rogues (Jay's gallery) · 🛟 Info (cabin rules, tap-to-call emergency numbers).

- `index.html`: the whole app (mobile-first, no build step)
- `sw.js`: offline cache. **Bump `CACHE` in sw.js on every redeploy** so phones pick up the new version.
- `assets/`: compressed images (maps, Rogues Gallery posters)

Backend: a dedicated free Supabase project (`last-catch-cup`). The page uses the public publishable key. Anonymous phones can read the
scoreboard, add score entries (checked: valid points per category, species list, sane lengths, rate limited) and rename crew slots.
Undo only works on entries made from the same phone (`lc_undo` RPC). Reset is the `lc_reset` RPC: the organiser PIN is checked on the
server against a bcrypt hash (it isn't in this code), with a lockout after 10 wrong tries in 15 minutes.
