# valentine 💘

A playful, animated Valentine proposal web project with responsive UI, mobile-friendly behavior, and an interactive celebration flow.

## Live Config Driven

This project now reads editable content from `config.json`, so you can update names, messages, letter text, and coupon details from one place.

## Highlights

- Responsive layout for desktop and mobile
- Smooth page transitions and preloading behavior
- Rounded animated buttons with hover effects
- Cute dark/light mode toggle button with saved preference
- Mobile-only `No` button dodge behavior
- `Yes` flow celebration:
  - Firecracker burst animation
  - Envelope appears
  - Letter slides out from envelope
  - Clicking letter opens a realistic coupon ticket
- Overlay close button included in celebration flow

## Project Structure

- `index.html` – landing page
- `no1.html`, `no2.html`, `no3.html` – no-flow pages
- `yes.html` – yes response page
- `config.json` – editable content source (name, page texts, letter, coupon details)
- `netlify.toml` – Netlify deploy configuration
- `style.css` – all shared styling, animations, responsive rules
- `script.js` – interactions, transitions, preloading, celebration logic

## Run Locally

Because this is a static project, you can open `index.html` directly in your browser.

For best behavior (prefetch/navigation), using a local server is recommended:

### Option 1: VS Code Live Server

1. Install Live Server extension.
2. Right-click `index.html` → **Open with Live Server**.

### Option 2: Python HTTP server

```bash
python -m http.server 5500
```

Then open: `http://localhost:5500`

## Customization

- Edit `config.json` to change all core texts without touching code:
  - `person.name`
  - `pages.index/no1/no2/no3/yes`
  - `celebration.letter.*`
  - `celebration.ticket.*`
  - `ticket.title` supports `{name}` token, e.g. `Ticket for {name}`
- Tune animation and theme variables in `style.css`.
- Modify behavior in `script.js`:
  - `wireNoButtons()` for No-button logic
  - `runCelebrationFlow()` for Yes-flow sequence

### `config.json` quick map

- `meta.siteTitle` → browser tab title
- `person.name` → used inside coupon via `{name}` token
- `pages.*` → per-page heading/subheading text
- `celebration.*` → envelope title/subtitle, letter content, ticket lines

## GitHub Publish

```bash
git add .
git commit -m "Update valentine project"
gh repo create valentine --source . --remote origin --public --push
```

If the repo already exists, use:

```bash
git push -u origin main
```

## Netlify Hosting

This repo is ready for Netlify deployment.

### Option 1: Deploy from GitHub (recommended)

1. In Netlify, click **Add new site** → **Import an existing project**.
2. Select your GitHub repo: `codeXparadise/valentine`.
3. Build settings are auto-read from `netlify.toml`.
4. Deploy.

### Option 2: Manual deploy

1. Open Netlify dashboard.
2. Drag and drop the project folder.

No build command is required because this is a static site.

## Changelog

### 2026-02-13

- Added central `config.json` to control name, page text, letter text, and coupon details.
- Wired all pages to load content from `config.json` using `script.js` defaults as fallback.
- Fixed deployed `Yes` click behavior by making celebration trigger robust for Netlify URL formats.
- Added explicit `yes-btn` markers in proposal pages for reliable event handling.
- Added `netlify.toml` and `.gitignore` for clean static deployment setup.
- Added cache-control rules for `*.html`, `script.js`, and `config.json` to reduce stale-deploy issues.
- Added global dark/light mode toggle with localStorage persistence across pages.

## Deployment Parity (Local = Netlify)

To ensure deployed behavior matches local behavior:

1. Keep `config.json` in the repository root.
2. Keep all page links as relative links (already configured).
3. Use Netlify deploy from the `main` branch.
4. After each deploy, open the site with hard refresh once (`Ctrl+F5`) if browser cache is old.
5. Confirm latest deploy status is **Published** in Netlify before testing.

## License

Personal/demo use.
