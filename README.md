# valentine 💘

A playful, animated Valentine proposal web project with responsive UI, mobile-friendly behavior, and an interactive celebration flow.

## Highlights

- Responsive layout for desktop and mobile
- Smooth page transitions and preloading behavior
- Rounded animated buttons with hover effects
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

- Update texts directly in the HTML pages.
- Tune animation and theme variables in `style.css`.
- Modify behavior in `script.js`:
  - `wireNoButtons()` for No-button logic
  - `runCelebrationFlow()` for Yes-flow sequence

## License

Personal/demo use.
