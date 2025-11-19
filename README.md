# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/46c3b1f7-4484-40fa-a402-f43a941a4f32

## Phase 1 Modernization Snapshot

- **Backend**: Custom Node.js API (`npm run server`) with JWT auth, AI gateway isolation, and Postgres (Supabase) adapter. See [`docs/SYSTEM_OVERVIEW.md`](docs/SYSTEM_OVERVIEW.md) for architecture and deployment guidance.
- **Frontend**: Vite + React + shadcn/ui with protected routes, organization-aware shell, and API-aware data hooks.
- **Roadmap**: Future security, clinical, and scalability milestones are tracked in [`TODO_ROADMAP.md`](TODO_ROADMAP.md).

## Local Development

```bash
# Install dependencies
npm install

# Start the backend API on http://localhost:4000
npm run server

# In a second terminal, run the React client
npm run dev
```

> Set environment variables using `.env` (see `.env.example`). `VITE_API_URL` must point to the running API for login and data retrieval to succeed.

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Frontend | Base URL for every call that leaves the browser. Point it at the deployed API host (defaults to `http://localhost:4000`). |
| `PORT` | Backend | Port that the Node API listens on. |
| `CLIENT_ORIGIN` | Backend | Comma-separated list of origins that are allowed to hit the API (drives the CORS headers). |
| `JWT_SECRET` | Backend | Secret used to sign/verify the JWT tokens that are returned on `/api/auth/login` and `/api/auth/signup`. |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Backend | Optional Postgres (Supabase) connection. When present, users + master data are persisted to Supabase; otherwise an in-memory store is used for local prototyping. |
| `SKIP_REMOTE_SEED` | Backend | Set to `true` to prevent the API from re-seeding reference data on every boot. |
| `AI_GATEWAY_URL` / `AI_GATEWAY_KEY` | Backend | Optional upstream AI integration. |

Copy `.env.example` into `.env` (frontend) and `.env.server` (backend) or feed these values via your secrets manager in production.

## API endpoints

All routes are served from the Node.js API (`npm run server`). `Authorization: Bearer <token>` is required for any path flagged below as “secure”.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Lightweight probe for uptime checks. |
| `POST` | `/api/auth/signup` | Creates a clinician account, hashes the password with `scrypt`, seeds the default units, and returns a JWT + profile. |
| `POST` | `/api/auth/login` | Validates credentials, issues a JWT, and returns the sanitized user profile. |
| `GET` | `/api/auth/me` *(secure)* | Returns the authenticated user that matches the presented JWT. |
| `GET` | `/api/master-data/:type` *(secure)* | Fetches master data (labs, drugs, assessments, procedures). |
| `POST` | `/api/ai/triage` *(secure)* | Sends contextual prompts to the triage assistant (uses a deterministic safe-mode reply when no AI gateway is configured). |

Errors are always JSON with `{ error: string | { fieldErrors: ... } }` so the frontend can display meaningful validation feedback.

## Deployment checklist

1. **Provision Postgres** – either via Supabase or another managed Postgres that exposes the same schema as `server/seed/masterData.js`.
2. **Configure secrets** – set `JWT_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` (or wire up your own Postgres adapter) plus your allowed client origins.
3. **Build the UI** – `npm install && npm run build` generates the production-ready assets in `dist/`.
4. **Run the API** – `npm install && npm run server` on the server host (Node 18+). Use a process manager (PM2/Systemd) and expose `/health` for your load balancer checks.
5. **Set the frontend origin** – configure `VITE_API_URL` (at build time) or `PUBLIC_URL` in your hosting provider so the browser knows where to call the API.
6. **Smoke test** – hit `/api/auth/signup` and `/api/auth/login` manually (or via the React form) to confirm the JWT + localStorage flow works before cutting traffic over.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/46c3b1f7-4484-40fa-a402-f43a941a4f32) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/46c3b1f7-4484-40fa-a402-f43a941a4f32) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
