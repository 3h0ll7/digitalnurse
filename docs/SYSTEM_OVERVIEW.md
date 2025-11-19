# Digital Nurse Buddy — Platform Overview

## 1. Current state
- The entire experience now runs as a **public, credential-free web app**. No JWTs, auth guards, or backend APIs are required.
- All reference data (procedures, labs, assessments, flashcards, mind maps) ships with the repository, keeping demos deterministic and offline-friendly.
- Navigation drops users straight into the main dashboard and every route is immediately available.

## 2. Frontend architecture
```
React (Vite + TypeScript)
├─ Contexts: Preferences, UI drawers, toasts
├─ Layout: SecureShell + SystemStatusBar + PrimaryNav
├─ Pages: Home, Procedures, Labs, Calculators, AI Assistant, Flashcards, Mind Maps, Assessments
└─ Data: Local JSON/TS modules inside src/data
```
- shadcn/ui and Tailwind CSS power the adaptive shell and cards.
- React Router v6 handles all routes; `<SecureShell>` wraps the clinical navigation and renders children via `<Outlet>`.
- React Query remains configured for future integrations but no longer issues network calls.

## 3. Data sources
- `src/data/procedures.ts`, `labValues.ts`, `assessmentScales.ts`, etc. contain the canonical copy of bedside content.
- Pages read directly from these modules, so filtering/searching feels instant and never depends on environment variables.
- To extend the catalogue, append new records to the relevant data file and the UI will automatically reflect them.

## 4. AI Assistant
- The AI Nursing Assistant now synthesizes answers locally using curated templates triggered by keywords.
- Because responses are generated client-side, there are no API keys, tokens, or rate limits to manage.
- The UI still surfaces typing indicators and guidance bubbles so the workflow feels interactive even without a model backend.

## 5. Environment & deployment
- **No environment variables are required.** `npm install && npm run dev` is enough for local work.
- Production builds are created with `npm run build` and can be hosted on any static provider (Vercel, Netlify, S3, etc.).
- Preferences and other lightweight settings persist via local storage only.

## 6. Future integration points
Even though the app is now public-access, the architecture leaves clear seams for reintroducing services:
- Replace the local data arrays with fetch calls (React Query hooks are already wired up).
- Swap the local AI responder for a real gateway inside `src/pages/AIAssistant.tsx`.
- Add secure contexts by reintroducing an AuthProvider if/when a backend becomes available.

For now, the priority is delivering a polished, zero-setup experience that teams can demo anywhere.
