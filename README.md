# Kids Planner ⭐

A tap-to-earn-stars daily plan for a kid's iPad, hosted on GitHub Pages.

The page you see on GitHub Pages is a **locked** page: a number keypad and an
encrypted blob. The plan only appears after the right code is tapped. The code
is **not** stored anywhere in this repo, and the readable plan never gets pushed.

## How it works

| File | Public? | What it is |
| --- | --- | --- |
| `private/plan.html` | **No** (git-ignored) | The real plan you edit. Never committed. |
| `tools/encrypt.mjs` | Yes | Encrypts `private/plan.html` into `index.html`. Asks for the code; never saves it. |
| `tools/lock-template.html` | Yes | The keypad page the encrypted plan is placed into. |
| `index.html` | Yes | The generated locked page that GitHub Pages serves. |
| `robots.txt`, `.nojekyll` | Yes | Keep search engines away; serve files as-is. |

Encryption: AES-256-GCM with a key derived from the code by PBKDF2-SHA256
(600,000 rounds, random salt). The browser decrypts it after the code is tapped.
A wrong code simply fails to decrypt.

## Update the plan

1. Edit `private/plan.html` (open it straight in a browser to preview; no code needed).
2. Re-lock it:

   ```bash
   node tools/encrypt.mjs      # asks for the code twice, hidden
   ```

3. Publish:

   ```bash
   git add -A
   git commit -m "Update plan"
   git push
   ```

GitHub Pages updates about a minute later. Stars earned on the iPad are kept
(they live in the iPad's browser storage, not in the repo).

## First-time setup

```bash
cd ~/Projects/kids-palnner
git init -b main
git add -A
git status                  # private/ must NOT be listed
git commit -m "Kids planner"
gh repo create kids-palnner --public --source=. --push
gh api -X POST repos/{owner}/kids-palnner/pages -f "source[branch]=main" -f "source[path]=/"
```

(Or in the browser: repo → Settings → Pages → Deploy from branch → `main` / `(root)`.)

The site will be at `https://<your-github-username>.github.io/kids-palnner/`.
On the iPad: open it in Safari → Share → **Add to Home Screen**.

## Good to know

- Needs **https** (GitHub Pages, or `localhost`) — browsers only allow the
  decryption on secure pages, so a plain `http://192.168.x.x` address won't unlock.
- A short numeric code keeps casual visitors out, but someone determined could
  guess it offline by trying every combination. For stronger privacy, use a
  longer code (the script accepts 4–12 digits) and keep personal details out of
  the plan.
- Before every push, `git status` should never show anything under `private/`.
