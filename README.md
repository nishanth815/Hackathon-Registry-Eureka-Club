# Hackathon Registry — Eureka Club

A simple website built for the Eureka Club's 2025 Batch hackathon task. It shows a list of hackathon teams to any visitor, and lets a logged-in admin add, edit, and delete team entries.

## Live demo

https://nishanth815.github.io/Hackathon-Registry-Eureka-Club/

## Features

- **Viewer mode (default):** anyone opening the site can browse the full list of registered teams — team name, leader, project idea, and status.
- **Admin mode:** logging in with the admin password unlocks full CRUD controls:
  - **Create** — add a new team
  - **Read** — view all teams in a card grid
  - **Update** — edit any existing team's details
  - **Delete** — remove a team, with a confirmation step
- **No backend required:** data is stored in the browser using `localStorage`, so it's easy to run and deploy as a static site.
- **Custom theme:** dark background with a beige/cream accent palette, using Plus Jakarta Sans for text and JetBrains Mono for small labels.

## Tech stack

- HTML5
- CSS3 (vanilla, no frameworks)
- JavaScript (vanilla, no frameworks)
- Browser `localStorage` for data persistence

## Project structure

```
├── index.html      # Page structure (viewer cards + admin panels)
├── style.css       # Styling, using the required color palette
├── script.js       # CRUD logic, admin login, and rendering
└── README.md
```

## Running locally

1. Clone the repository:
```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
```
2. Open `index.html` directly in your browser, or serve it locally:
```bash
   npx serve .
```
3. That's it — no build step, no dependencies to install.

## Admin access

- Click **Admin login** in the top right.
- Default password: `admin123`
- Change this in `script.js` (the `ADMIN_PASSWORD` constant) before deploying if you want a different password.
- Admin status only lasts for the current browser tab/session (`sessionStorage`), so refreshing keeps you logged in but closing the tab logs you out.

> Note: since this runs entirely client-side, the password is not a real security boundary — it's a simple way to separate viewer and admin experiences for this assignment, not a production authentication system.

## Deployment

This is a static site, so it can be deployed for free with **GitHub Pages**:

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` folder.
4. Save — your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Data

Team data ships with four example entries and is stored per-browser using `localStorage`. Since each visitor's edits stay in their own browser, the "shared" experience is best demonstrated by having the admin add/edit data and then screenshot or screen-record it for submission, or by wiring `script.js` up to a real backend if a shared live database is required.

## Author

Built for the Eureka Club hackathon assignment, 2025 Batch.
