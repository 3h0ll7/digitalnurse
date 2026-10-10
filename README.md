<p align="center">
  <img src="public/logo.png" alt="Digital Nurse Buddy" width="120" />
</p>

<h1 align="center">Digital Nurse Buddy</h1>

<p align="center">
  <strong>Your AI-powered clinical companion — built by a nurse, for nurses.</strong>
</p>

<p align="center">
  <a href="https://lovable.dev/projects/46c3b1f7-4484-40fa-a402-f43a941a4f32">🌐 Live App</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/platform-web%20%7C%20PWA-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/built%20with-React%20%2B%20TypeScript-61dafb?style=flat-square" />
</p>

---

> **App is now fully public-access with no login required.** Every screen, workflow, and calculator loads instantly without credentials or backend dependencies.

> **Update:** The access screen has been removed. The app now loads directly into the main workspace.

---

## 📋 Overview

**Digital Nurse Buddy** is an evidence-based clinical reference tool designed for ICU/ER nurses and nursing students. It delivers rapid access to procedures, lab values, drug calculators, ECG interpretation, flashcards, and AI-assisted guidance — all in a responsive, offline-ready interface.

### Key Highlights

- **Clinical Cockpit** — Evidence-informed dashboards for procedures, labs, calculators, flashcards, and more.
- **Offline-Friendly Data** — All master data lives in `src/data/*`, so demos run without APIs or environment variables.
- **Responsive Shell** — shadcn/ui components, Lucide icons, and Tailwind CSS create a polished experience across mobile and desktop.
- **AI Assistant** — Streams answers from the open-source **gpt-oss-120b** model (via Groq), with Google Gemini as an automatic fallback.
- **ECG Module** — Interactive ECG interpretation guide with rhythm identification and clinical pearls.
- **PWA Support** — Install as a native-like app on any device for instant access on the ward.

---

## ✨ Features

| Module | Description |
|---|---|
| 🏥 **Procedures** | Step-by-step guides for common ICU/ER procedures |
| 🧪 **Lab Values** | Quick-reference normal ranges with clinical significance |
| 💊 **Drug Calculators** | Dosing calculators for critical-care medications |
| 💓 **ECG Interpreter** | Rhythm identification, axis deviation, and clinical pearls |
| 🧠 **Flashcards** | Spaced-repetition study cards for NCLEX and clinical review |
| 🤖 **AI Assistant** | Clinical Q&A powered by open-source gpt-oss-120b, with Gemini fallback |
| 📊 **Clinical Dashboards** | At-a-glance views for vitals, assessments, and workflows |
| 📱 **PWA / Offline** | Works without internet — perfect for bedside use |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **UI** | shadcn/ui, Tailwind CSS, Lucide Icons |
| **Backend** | Supabase (Auth, Database, Edge Functions) |
| **Data** | Local JSON (`src/data/*`) + Supabase tables |
| **Deployment** | Lovable.dev (CI/CD) |
| **PWA** | Vite PWA Plugin, Service Worker |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/3h0ll7/digitalnurse.git
cd digitalnurse

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Copy the example file and configure as needed:

```bash
cp .env.example .env
```

> **Note:** The app runs fully offline with local data. Supabase credentials are only needed for backend features (auth, sync, AI helper).

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Optional |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key | Optional |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project id | Optional |

### 🤖 AI assistant models

The assistant calls the Supabase Edge Function `supabase/functions/ai-chat`, which picks a model on the server:

| Provider | Model | Edge Function secret |
|---|---|---|
| Groq (default) | `openai/gpt-oss-120b` — open-weight, Apache-2.0 | `GROQ_API_KEY` |
| Lovable AI gateway | `google/gemini-3.1-flash-lite` | `LOVABLE_API_KEY` |

- Users choose the model in the assistant's settings; if it fails before answering (down, rate-limited, out of credits, slow), the other one answers automatically and the app says so.
- Each IP gets 10 messages per day (`ai_rate_limits` table).
- AI keys are **server-side secrets**, never `VITE_` variables. Add the Groq key with:

```bash
supabase secrets set GROQ_API_KEY=gsk_your_key --project-ref <project-id>
supabase functions deploy ai-chat --project-ref <project-id>
```

---

## 📁 Project Structure

```
digitalnurse/
├── docs/                  # Documentation and design specs
├── public/                # Static assets (icons, manifest)
├── server/                # Server-side utilities
├── src/
│   ├── components/        # Reusable UI components
│   ├── data/              # Local clinical data (JSON)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Route-level page components
│   └── styles/            # Global styles and Tailwind config
├── supabase/              # Supabase migrations and config
├── .env.example           # Environment variable template
├── TODO_ROADMAP.md        # Development roadmap
└── README.md              # ← You are here
```

---

## 🗺 Roadmap

See [`TODO_ROADMAP.md`](./TODO_ROADMAP.md) for the full development roadmap.

**Upcoming priorities:**

- [ ] Expanded drug database with interaction checker
- [ ] Ventilator settings quick-reference
- [ ] Arabic language support (RTL)
- [ ] Multi-patient tracker for shift handoffs
- [ ] NCLEX-RN practice exam mode
- [ ] Community-contributed flashcard decks

---

## 🤝 Contributing

Contributions are welcome! Whether it's a bug fix, new clinical module, or UI improvement:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Hassan Salman** — ICU Nurse & Developer

- 🏥 Building clinical tools at the intersection of nursing and AI
- 🌐 Brand: **Digital Nurse Buddy**
- 🔗 GitHub: [@3h0ll7](https://github.com/3h0ll7)

---

<p align="center">
  <em>Built with ❤️ at the nursing station — between alarms and assessments.</em>
</p>
