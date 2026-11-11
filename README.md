# Workout

A single-page workout tracker for training at home and at the gym. It's one `index.html` file with no build step, no dependencies and no server-side code. It runs on localhost, straight from the file, or on GitHub Pages.

## What it does

- **Locked with a PIN.** The app opens to a keypad. The PIN is **1099**. Each new browser tab asks again, and **Lock** in the top corner locks it right away.
- **Train.** Every day of the week has two plans, one for **Home** and one for **Gym**. Pick a day, pick a location, and log each set's **weight** and **reps** (or seconds for holds).
  - Each exercise shows what you did **last time**, and those numbers appear as hints in the inputs. Tap ✓ on an empty set to repeat last time's numbers.
  - **Add set** and **Remove last set** change how many sets you do.
  - **Session details** covers the date, a timer, duration, energy (1–5), body weight that day and notes.
  - An unfinished session is saved as you type, so a refresh or a closed tab doesn't lose sets. **Save session** moves it to History.
  - **Copy for Claude** (under Session details, and on each session in History) copies a detailed prompt: your goals, height, latest body stats, the session's planned versus actual sets, last time's numbers, your last 4 weeks, and specific questions. Paste it into Claude for feedback and next-session targets.
  - **Learn more** on any exercise opens a panel over the page with a YouTube demo that plays inline (`playsinline`, so iPhones don't jump to fullscreen), start and end position photos, and the equipment and notes. Closing the panel stops the video.
- **History.** Every saved session grouped by month, with sets, duration and volume, plus **Exercise progress**: pick an exercise to see every time you logged it and your top set.
- **Body.** Log body weight, body fat and measurements (neck, shoulders, chest, waist, hips, arms, forearm, thighs, calf). It shows the change since the previous entry and since your first one, BMI (once your height is set), and how far you are from your goal weight. A body weight entered in a session is added here too.
- **Plan.** Edit any day for home or gym: title, focus, and each exercise's sets, target, equipment and cable attachment, superset letter, notes, YouTube link and image links. Exercises can be reordered, added or deleted, and **Copy to Gym/Home** duplicates a day's plan to the other location.
- **Settings.** Switch between lb/kg and in/cm, **export a backup** (JSON), **import a backup**, reset the plan to the default, or erase everything.

## Default weekly plan

Sessions are kept to about an hour or less. Pull day is on Wednesday so it stays three days away from Sunday climbing.

| Day | Home | Gym |
|---|---|---|
| Mon | Push: board push-ups, pike push-ups, cable chest press, DB press, lateral raise + rope triceps superset | Push: bench press, dips, overhead press, cable fly, lateral raise + pushdown superset |
| Tue | Legs & core: goblet squat, split squat, KB swing, pull-through, abduction + woodchop superset, hollow hold | Legs & core: back squat, RDL, lunges, kickback + woodchop superset, easy row |
| Wed | Pull: leaning cable body row, kneeling pulldown, DB row, face pull + cable curl superset, farmer hold | Pull: pull-ups, barbell row, cable row, lat pulldown, face pull + EZ curl superset |
| Thu | Tendons & mobility: eccentric wrist work, isometric holds, slow step-downs, external rotation | Same tendon work, starting with an incline walk |
| Fri | Skills & arms: handstand hold, planche lean, tuck L-sit, curl + triceps superset, hammer curl | Skills & arms on gym equipment |
| Sat | Light conditioning circuit that keeps grip fresh | Rower intervals plus a light circuit |
| Sun | Climbing day, with a 15-minute cooldown | Same |

Every cable exercise names its attachment and pulley height. There are no starting weights: the first time you log an exercise sets the baseline, and after that the app shows your last numbers so progression follows what you actually lifted.

## Demo videos and photos

Every exercise in the default plan has a built-in demo:

- **Videos.** One short YouTube tutorial per movement, checked to exist and allow embedding (November 2026). They play through `youtube-nocookie.com`, YouTube's privacy-enhanced embed. The panel credits the channel and has an **Open on YouTube** link.
- **Photos.** Start and end positions from [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) (public domain, Unlicense), stored in `images/`. A few calisthenics holds (planche lean, L-sit, hollow hold, handstand, wall sit and similar) aren't in that set, so those show the video's preview image instead. Some photos show a close variation (e.g. a strap row for the leaning cable body row).

**To use a different video:** Plan tab → the exercise → paste any YouTube link into **YouTube video** (`watch?v=`, `youtu.be/`, `shorts/` and `&t=` start times all work). Leave it empty to keep the built-in demo. **Image links** works the same way: paste one or more image URLs separated by spaces.

Built-in demos are matched by exercise name, so an exercise you add or rename (e.g. "Cable face pull") picks up its demo automatically. The library is the `MEDIA` table near the top of the script in `index.html`.

> Videos play on `localhost` and on GitHub Pages. If you double-click `index.html` and open it straight from disk (`file://`), YouTube refuses to play embedded videos, so the panel shows a **watch on YouTube** link instead. Photos work either way.

## Run it locally

From this folder:

```bash
cd ~/Projects/workout
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Any static server works (`npx serve`, VS Code Live Server). You can also double-click `index.html` to open it straight from disk, but demo videos only play from a server (see above).

> Data is stored per address. `localhost:8000`, `localhost:5500`, `file://` and your GitHub Pages URL each keep separate data. Use **Settings → Export backup / Import backup** to move data between them.

## Deploy to GitHub Pages

1. Create the repo and push (with the GitHub CLI):

   ```bash
   cd ~/Projects/workout
   git init -b main
   git add index.html README.md images
   git commit -m "Workout tracker"
   gh repo create workout --public --source=. --push
   ```

   Without the CLI, create an empty `workout` repo on github.com, then:

   ```bash
   git remote add origin https://github.com/<your-username>/workout.git
   git push -u origin main
   ```

2. On GitHub, open the repo's **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then choose **Branch** `main` and folder `/ (root)`, and click **Save**.
3. After a minute or so the app is live at `https://<your-username>.github.io/workout/`.

GitHub Pages on a free account needs a **public** repo. Private repos can use Pages on GitHub Pro, Team or Enterprise plans.

**On your phone:** open the Pages URL, then use *Share → Add to Home Screen* (iOS) or *Add to Home screen* (Android Chrome) to get an app-style icon.

## Your data

- Everything you log is saved in the browser's `localStorage` on that device. Nothing is sent to GitHub or anywhere else. The page only loads two fonts from Google Fonts, and YouTube is only contacted when you open a Learn more panel.
- Your phone and laptop keep **separate** logs. Export a backup on one and import it on the other to move your data.
- Clearing the browser's site data, or using a private window, deletes the logs. Export a backup now and then.

## About the PIN

The PIN keeps casual visitors out. It isn't real security:

- On GitHub Pages the page source is public. The PIN is stored as a SHA-256 hash rather than plain text, but a 4-digit PIN can be brute-forced in moments by anyone who reads the source.
- Your logs aren't exposed either way, because they never leave your device. What the PIN covers is the plan itself, which is in the public repo.

If you ever need the plan or data to be truly private, use a private repo with an access-controlled host (e.g. Cloudflare Pages + Cloudflare Access) or keep it on localhost.

### Changing the PIN

```bash
printf '1234' | shasum -a 256
```

Copy the hash, then replace the `PIN_HASH` value near the top of the `<script>` in `index.html`.

## Editing the default plan in code

The in-app **Plan** tab is the easiest place to make changes, and those changes are saved on that device. To change the plan that **new devices** start with, edit `DEFAULT_PLAN` in `index.html`. Each exercise is one line:

```js
['Cable face pull', 3, '15', 'Cable, tricep rope, high pulley', 'Notes here', 'A', 'reps']
//  name             sets target  equipment / attachment          notes        superset  'reps' or 'time'
```

`'time'` means the target and logged values are in seconds. Exercises that share a superset letter on the same day are shown as a pair. A device that already has a saved plan keeps it until you press **Settings → Reset plan to default**.

## Backup file format

**Export backup** downloads `workout-backup-YYYY-MM-DD.json` with this structure:

```json
{
  "version": 1,
  "settings": { "w": "lb", "l": "in", "loc": "home" },
  "profile": { "height": "", "goal": "", "notes": "" },
  "plan": { "mon": { "home": { "title": "", "focus": "", "minutes": 55, "exercises": [] }, "gym": {} } },
  "sessions": [
    { "date": "2026-11-11", "dayId": "mon", "loc": "home", "title": "Push", "duration": 52, "energy": 4,
      "bodyweight": 172.4, "notes": "", "exercises": [ { "name": "Push-ups on push-up board", "type": "reps",
      "sets": [ { "w": null, "r": 12 } ] } ] }
  ],
  "body": [ { "date": "2026-11-11", "weight": 172.4, "waist": 33 } ]
}
```

A `null` weight means bodyweight.

## Files

```
workout/
├── index.html   the whole app (HTML, CSS, JS)
├── images/      exercise photos (Free Exercise DB, public domain)
└── README.md    this file
```

## Credits

- Exercise photos: [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) by yuhonas, released into the public domain under the Unlicense.
- Demo videos are embedded from YouTube and belong to their creators, who are named in each panel.
