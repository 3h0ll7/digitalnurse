# Digital Nurse Buddy — Platform Overview

## 1. Summary of Phase 1 Changes
- Introduced a standalone Node.js API server (`server/`) with explicit routing, auth, and AI gateway layers.
- Added a master data repository for procedures, labs, drugs, and assessments backed by Supabase Postgres (with deterministic in-memory fallback for local prototyping).
- Implemented JWT-based authentication plus a multi-unit context model that is now consumed by the React client.
- Refactored the UI shell (secure header, protected routes, clinical context selectors) to support multi-user deployments.

## 2. Backend Architecture
```
+--------------------+       +-------------------------+        +-------------------+
|  React Frontend    | <---> |  Node Secure API Layer  | <----> | Postgres (Supabase)|
|  (Vite + RQ)       |  JWT  |  /auth, /master-data,   |  SQL   |  Master Data, User |
|                    |       |  /ai gateway endpoints  |        |  Tables            |
+--------------------+       +-------------------------+        +-------------------+
           |                               |                               |
           |                               v                               |
           |                     +---------------------+                    |
           +------------------>  | AI Gateway Adapter  |  <------------------+
                                  (Proxy to vendor or
                                   deterministic safe mode)
```
- Security headers, rate limiting stubs, and strict JSON parsing are enforced within `server/router.js` and `server/utils/http.js`.
- Postgres access is abstracted by `server/lib/database.js` so hospitals can swap Supabase for on-prem clusters without touching handlers.

## 3. API Structure
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Lightweight uptime probe for load balancers. |
| GET | `/api/status` | Returns build metadata and uptime (used in monitoring dashboards). |
| POST | `/api/auth/register` | Creates a clinician account, hashing credentials with scrypt. |
| POST | `/api/auth/login` | Issues JWT for existing accounts. |
| GET | `/api/auth/me` | Returns sanitized clinician profile + assigned units. |
| GET | `/api/master-data/:type` | Fetches master datasets (`procedures`, `labs`, `drugs`, `assessments`). |
| POST | `/api/ai/triage` | Proxies safe prompts to the AI service and enforces auditing context. |

> **Modularity**: Adding new resources only requires implementing a controller + registering a path in `server/index.js` because request parsing, auth and CORS are centrally enforced.

## 4. Environment Variables
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL the React client uses to call the API. |
| `PORT` | API listening port (defaults to `4000`). |
| `CLIENT_ORIGIN` | Comma-separated list of domains allowed via CORS. |
| `JWT_SECRET` | Symmetric key for signing/validating JWTs. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Optional managed Postgres connection (uses service role for elevated access). |
| `SKIP_REMOTE_SEED` | When `true`, disables auto-seeding master data on boot. |
| `AI_GATEWAY_URL`, `AI_GATEWAY_KEY` | Optional upstream AI endpoint + credential. |

The repository includes `.env.example` with sane defaults for both the frontend and backend.

## 5. Deployment Steps
1. **Provision Postgres** (Supabase project or hospital-managed cluster) and create tables defined in `server/db/schema.sql` (or equivalent DDL on your platform).
2. **Configure secrets**: copy `.env.example` to `.env`, then inject real JWT, Supabase, and AI keys into your secrets manager.
3. **Install dependencies**: `npm install` (frontend) and ensure Node 18+ for the API. No external frameworks are required beyond what is already vendored.
4. **Boot API**: `npm run server` — the router will seed master data (unless disabled) and expose `/health` for liveness checks.
5. **Boot frontend**: `npm run dev` or `npm run build && npm run preview`, ensuring `VITE_API_URL` points to the API host.
6. **Set up monitoring**: target `/health` for liveness, `/api/status` for readiness, and log aggregate events at the API gateway.

## 6. Future Phases
Phase 1 lays the groundwork for the remaining roadmap (see `TODO_ROADMAP.md`). Upcoming work will focus on:
- **Phase 2**: Transport security (TLS termination, audit logging, minimum cipher suites) and privacy policies.
- **Phase 3**: Clinical validation, red teaming, and usability research with frontline nurses.
- **Phase 4**: Scalability (load tests, autoscaling, caching, Kubernetes) and cost observability.
- **Phase 5**: Certification (HIPAA/GDPR, ISO 13485, national MoH approvals).
- **Phase 6**: Enterprise roll-out with HL7/FHIR integration, monitoring SLOs, and hospital analytics feeds.
