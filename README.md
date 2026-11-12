# Daily Planner 🗓️

An ADHD‑friendly daily planner, hosted on GitHub Pages. It's linked to the
[Workout](https://alireza0511.github.io/workout/) app and Jonna's
[Star Plan](https://alireza0511.github.io/kids-palnner/).

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
- **Setup tab:** edit the default template (weekdays, Jonna / no‑Jonna,
  workout‑days only, buffer), Jonna's usual days, workout days, habits, and
  backups.

## Security

| File | Public? | What it is |
| --- | --- | --- |
| `private/plan.html` | **No** (git‑ignored) | The real planner you edit. Never committed. |
| `tools/encrypt.mjs` | Yes | Encrypts `private/plan.html` into `index.html`. Asks for the password; never saves it. |
| `tools/lock-template.html` | Yes | The password page the encrypted planner is placed into. |
| `index.html` | Yes | The generated locked page that GitHub Pages serves. |
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

## Update the planner

1. Edit `private/plan.html` (open it straight in a browser to preview; it runs
   in an unencrypted preview mode without the password).
2. Re‑lock it:

   ```bash
   node tools/encrypt.mjs      # asks for the password twice, hidden
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

The site will be at `https://alireza0511.github.io/daily-planner/`.
On the phone: open it in Safari → Share → **Add to Home Screen**.

Needs **https** (GitHub Pages, or `localhost`): browsers only allow the
decryption on secure pages.
