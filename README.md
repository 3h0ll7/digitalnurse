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
