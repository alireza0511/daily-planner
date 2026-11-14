# Daily Planner 🗓️

This repo hosts several apps on one GitHub Pages site. `index.html` at the root is
a small menu linking to:

- `daily/`: this daily planner (`https://alireza0511.github.io/daily-planner/daily/`)
- `kids/`: Jonna's Star Plan (see `kids/README.md`)
- `workout/`: the workout tracker (see `workout/README.md`)

The paths below are relative to `daily/`.

An ADHD‑friendly daily planner, hosted on GitHub Pages. It's linked to the
[Workout](https://alireza0511.github.io/daily-planner/workout/) app and Jonna's
[Star Plan](https://alireza0511.github.io/daily-planner/kids/).

The page on GitHub Pages is a **locked** page: a password box and an encrypted
blob. The planner only appears after the right password is entered. The
password is **not** stored anywhere in this repo, and the readable planner
never gets pushed.

## What's in a day

- **Energy:** Low / OK / Good. On a Low day only THE Thing shows, with a
  "minimum viable day" reminder.
- **Jonna with me:** flips the day's time blocks between the with‑Jonna and
  without‑Jonna versions and shows her Star Plan card.
- **Brain dump** with a 5‑minute timer.
- **3 Things:** THE Thing, Would be nice, If I'm on fire.
- **Workout card:** reads the Workout app's data on the same device (read only)
  to show your next session (A/B/C), what you've done this week, and whether
  you trained that day.
- **Time blocks** from your template, with buffers. The current block is
  highlighted. Edit, add or remove blocks for a single day.
- **Habits**, a **shutdown** checklist, **tomorrow's THE Thing** (copied into
  tomorrow automatically) and **notes**.
- **Week strip:** 🎯 THE Thing done, 💪 workout logged, 👧 Jonna day.
- **Dates (Setup tab):** ranges that change specific days: Jonna with her mom
  or with you, and **Travel** / **Transit** days that switch to a lighter travel
  schedule with a 📍/✈️ banner. Comes preloaded with November 2026: Jonna with
  her mom Nov 12 and Nov 19–29; Houston → Barcelona Nov 19, Barcelona Nov 20–24,
  Valencia Nov 25, London Nov 26, home to Houston Nov 27.
- **End of day:** **📋 Copy for Claude** copies a prompt with the whole day
  (3 Things, blocks, habits, shutdown, workout, Jonna, calendar, notes, last 7
  days) for your Claude agent. **💾 Save log** writes the same report to
  `logs/YYYY-MM-DD.md`. **📅 Day → calendar** exports the day's blocks as `.ics`.
- **💼 Work card** (weekdays): write what you did at work. The time blocks
  just show Work 8–11, lunch at 11:00, and Work 11:45–4:00.
- **🍽️ Meals:** breakfast, lunch, dinner, snacks (autocompletes from what you've
  eaten before) and "I cooked dinner". **🍳 What should I cook?** suggests 3
  dinners from your ideas list (Setup → Dinner ideas). It skips what you cooked
  in the last 5 days and prefers ⭐ Jonna‑friendly or ⚡ quick meals when that fits.
- **👧 Jonna's routine:** her day (Setup → Jonna's routine) appears inside your
  time blocks; switch it on/off with the button on the Time blocks card.
- **Copy for Claude / 📤 Share:** copies the report, or on iPhone opens the
  share sheet so you can send it straight to the Claude app.
- **Deadlines:** a ⏰ Due soon card with a countdown (shown up to 14 days
  ahead) and a "Make THE Thing" button. Comes with the speed ticket course
  (due before Nov 17).
- **Setup tab:** edit the default template (weekdays, Jonna / no‑Jonna,
  workout‑days only, buffer), Jonna's usual days, workout days, habits, and
  backups.

## Security

| File | Public? | What it is |
| --- | --- | --- |
| `private/plan.html` | **No** (git‑ignored) | The real planner you edit. Never committed. |
| `tools/encrypt.mjs` | Yes | Encrypts `private/plan.html` into `index.html`. Asks for the password; never saves it. |
| `tools/lock-template.html` | Yes | The password page the encrypted planner is placed into. |
| `logs/` | **No** (git‑ignored) | Your daily reports, `YYYY-MM-DD.md`. |
| `index.html` | Yes | The generated locked page that GitHub Pages serves. |
| `manifest.webmanifest`, `icons/` | Yes | Makes it an installable app (name, icon, colours). |
| `sw.js` | Yes | Service worker: works offline, updates when online. Only caches the encrypted page. |
| `robots.txt`, `.nojekyll` | Yes | Keep search engines away; serve files as‑is. |

- **Page:** AES‑256‑GCM, key from the password via PBKDF2‑SHA256 (600,000
  rounds, random salt). A wrong password simply fails to decrypt.
- **Your entries:** also AES‑256‑GCM encrypted in the browser's storage with a
  second key derived from the same password (its own random salt), so nothing
  you type is readable in plain text on the device.
- Locks itself after 20 minutes idle, on reload, or with the 🔒 button.
- Data lives only in that browser. Use **Setup → Export backup** to move it.
  The exported file is **not** encrypted, so keep it private.
- If you change the password, export a backup first, then import it after
  unlocking with the new one (old saved data can't be read with a new password).

## Daily logs (`logs/`, git‑ignored)

`logs/` is in `.gitignore`, so your daily reports never get pushed.

- **Chrome or Edge on the Mac:** Setup → **Choose logs folder** → pick
  `~/Projects/daily-planner/logs` once. After that, **💾 Save log** writes
  `YYYY-MM-DD.md` straight into it (it asks for permission again after a
  browser restart). Tick "Save the log automatically" to save every time you copy
  for Claude.
- **Safari / iPhone:** Save log downloads the `.md` file; move it into `logs/`.

Each log starts with a small YAML header (date, energy, Jonna, location, THE
Thing done, blocks/habits done, workout), so an agent can read a folder of them.

## Calendars

**Google Calendar (live, read‑only).** One‑time setup, about 5 minutes:

1. Go to <https://console.cloud.google.com/> → create a project (e.g. "Daily Planner").
2. **APIs & Services → Library** → enable **Google Calendar API**.
3. **OAuth consent screen** → External → fill in the app name and your email →
   add the scope `.../auth/calendar.readonly` → add yourself under **Test users**.
4. **Credentials → Create credentials → OAuth client ID** → *Web application* →
   **Authorized JavaScript origins**: `https://alireza0511.github.io`
   (add `http://localhost:8000` too if you test locally).
5. Copy the **Client ID** into Planner → Setup → Calendars → **Connect Google**,
   and pick which calendars to show.

The access token stays in memory only (sign in again after locking). The
Client ID is saved in your encrypted settings. Events show on the Day tab, and
**+** turns one into a time block. The Google sign‑in popup works best in the
browser; in the iPhone Home Screen app it may bounce out to Safari.

**Apple Calendar.** Apple has no API a web page can use. Two options:

- Add your Google account to Apple Calendar (iPhone Settings → Calendar →
  Accounts). Both then show the same events, and the planner reads them through Google.
- Export: **📅 Day → calendar** (one day's blocks) or Setup → **Export Dates**
  (trip and Jonna's days). On iPhone/Mac, opening the `.ics` file offers to add
  the events to Apple Calendar; Google Calendar imports it under Settings → Import.

## Update the planner

1. Edit `private/plan.html` (open it straight in a browser to preview; it runs
   in an unencrypted preview mode without the password).
2. Re‑lock it:

   ```bash
   node daily/tools/encrypt.mjs   # asks for the password twice, hidden
   ```

3. Publish:

   ```bash
   git add -A
   git commit -m "Update planner"
   git push
   ```

## First‑time setup

```bash
cd ~/Projects/daily-planner
git init -b main
git add -A
git status                  # private/ must NOT be listed
git commit -m "Daily planner"
gh repo create daily-planner --public --source=. --push
gh api -X POST repos/{owner}/daily-planner/pages -f "source[branch]=main" -f "source[path]=/"
```

The site will be at `https://alireza0511.github.io/daily-planner/` (menu) and `…/daily-planner/daily/` (planner).
## Install as an app (PWA)

- **iPhone / iPad:** open the site in Safari → Share → **Add to Home Screen**.
- **Android / Chrome / Edge:** open the site → menu → **Install app**.
- **Mac:** Safari → File → **Add to Dock**, or Chrome → **Install Daily Planner**.

It opens full‑screen with its own icon and works offline. After you push a new
version, it picks it up the next time it opens online.

**iPhone note:** an app added to the Home Screen gets its own storage, separate
from Safari and from other Home Screen apps. So:

- Start using the planner from the installed app (anything typed in Safari
  first won't be there; use Export / Import backup to move it).
- The workout card can't read the Workout app's data there, so it shows the
  workout day and an **Open** button instead of your next session. On
  Android and desktop Chrome it still reads it.

Needs **https** (GitHub Pages, or `localhost`): browsers only allow the
decryption on secure pages.
