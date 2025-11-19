# Digital Nurse Buddy

## Project info

**URL**: https://lovable.dev/projects/46c3b1f7-4484-40fa-a402-f43a941a4f32

> **App is now fully public-access with no login required.** Every screen, workflow, and calculator loads instantly without credentials or backend dependencies.

> **Update:** The access screen has been removed. The app now loads directly into the main workspace.

## Overview

- **Clinical cockpit** – evidence-informed dashboards for procedures, labs, calculators, flashcards, and more.
- **Offline-friendly data** – all master data lives in `src/data/*`, so demos run without APIs or environment variables.
- **Responsive shell** – shadcn/ui components, Lucide icons, and Tailwind CSS create a polished experience across mobile and desktop.
- **AI helper** – the assistant now responds locally with curated guidance, keeping the UI helpful even without a model backend.

## Local development

```bash
# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

No additional services or environment variables are required.

## Production build & preview

```bash
npm run build
npm run preview
```

Deploy the contents of `dist/` to any static host (Vercel, Netlify, S3, etc.). There are no server-side requirements.

## Feature highlights

- Secure-shell inspired layout that keeps navigation, system status, and preferences always within reach.
- Procedures, labs, and assessments all reference the curated data bundled with the repo—perfect for offline demos.
- Calculators, flashcards, and mind maps showcase specialty tooling for bedside teams.
- AI Nursing Assistant supplies templated coaching without network calls, so staging builds never block on credentials.

## Contributing / editing

You can keep building via [Lovable](https://lovable.dev/projects/46c3b1f7-4484-40fa-a402-f43a941a4f32) or your preferred IDE:

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

Any changes committed here are immediately available to Lovable and downstream deployments.

## Tech stack

- Vite + React 18 + TypeScript
- shadcn/ui
- Tailwind CSS
- Lucide icons
