# Phaze Marketing Platform

Phaze Marketing Platform — a modern, responsive dashboard built for marketing agencies with a focus on community impact (specifically Kappa League).

Setup Instructions

Prerequisites: Ensure you have Node.js installed on your computer.

Install Dependencies:

```bash
npm install
```

Run Locally:

```bash
npm run dev
```

This will start the Vite dev server (usually at http://localhost:5173).

Deploying to Netlify via GitHub

- Commit all files to a GitHub repository.
- In Netlify: Add new site -> Import from GitHub -> select the repo.
- Netlify will use `netlify.toml` and `package.json`.

Build command: `npm run build`
Publish directory: `dist`

Tech Stack

- React 18
- Vite (Build tool)
- Tailwind CSS (Styling)
- Recharts (Data Visualization)
- Framer Motion (Animations)
- Lucide React (Icons)

See the project files for details and source in `src/`.
