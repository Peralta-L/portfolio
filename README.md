# Luis Peralta Aguirre · Portfolio

Personal portfolio for a backend engineer: a **Next.js 15** frontend on Vercel backed by a **Spring Boot 3 / Java 25** API and **PostgreSQL** on Render.

The site is statically generated and reads projects, skills and experience from the API, revalidating them every hour. The contact form posts to a validated, rate-limited endpoint that saves messages to PostgreSQL. If the API is asleep or down, the site falls back to bundled content, so it never renders empty.

```
 Browser ──► Vercel CDN ──► Next.js (SSG + ISR) ──GET──► Spring Boot API ──► PostgreSQL
    │                                                       ▲
    └──────────────── POST /api/contact (CORS) ─────────────┘
```

## Contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Run locally](#run-locally)
- [Environment variables](#environment-variables)
- [API](#api)
- [Database schema](#database-schema)
- [Deployment](#deployment)
- [Editing content](#editing-content)
- [Quality checks](#quality-checks)

## Tech stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix), Framer Motion, Lucide, Zod |
| Backend  | Java 25, Spring Boot 3.5 (Web, Data JPA, Security, Validation, Actuator), Lombok, Flyway, Maven |
| Database | PostgreSQL 16 |
| Hosting  | Vercel (frontend), Render (API + database), GitHub Actions (CI) |

## Project structure

```
portfolio/
├── frontend/                     Next.js app (deployed to Vercel)
│   ├── public/                   Static files; put resume.pdf here
│   └── src/
│       ├── app/                  Routes, layout, metadata, sitemap, robots, OG image
│       ├── components/
│       │   ├── layout/           Header (sticky nav) and footer
│       │   ├── sections/         Hero, About, Projects, Architecture, Skills, Experience, Education, Contact
│       │   └── ui/               shadcn/ui primitives (button, card, badge, input, label, tabs)
│       ├── content/              Site copy + fallback data (edit these to change the site)
│       ├── hooks/                useActiveSection, useScrolled
│       ├── lib/                  API client, contact client, utils
│       └── types/                Zod schemas and inferred API/content types
├── backend/                      Spring Boot API (deployed to Render)
│   ├── Dockerfile
│   └── src/main/java/com/portfolio/
│       ├── controller/           REST endpoints
│       ├── service/              Business logic, transactions
│       ├── repository/           Spring Data JPA repositories
│       ├── entity/               JPA entities
│       ├── dto/                  Request/response records + validation
│       ├── security/             Security filter chain, CORS, rate limiting
│       ├── config/               Typed configuration properties
│       └── exception/            Global RFC 9457 exception handler
│   └── src/main/resources/db/migration/   Flyway schema + seed data
├── docker-compose.yml            Local PostgreSQL
├── render.yaml                   Render Blueprint (API + database)
└── .github/workflows/ci.yml      Build, lint, typecheck, test
```

## Run locally

**Requirements:** Node.js 20+, JDK 25. Maven is not needed (the wrapper downloads it). Docker is optional.

### 1. API

The quickest option is to run the API on a throwaway **embedded PostgreSQL**, so no database install is needed:

```bash
cd backend
./mvnw spring-boot:test-run          # Windows: mvnw.cmd spring-boot:test-run
```

Or use a real PostgreSQL in Docker:

```bash
docker compose up -d                 # from the repo root
cd backend && ./mvnw spring-boot:run
```

The API starts on <http://localhost:8080>. Flyway creates the schema and seed data on first start. Check it with `curl localhost:8080/api/projects`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local           # points at http://localhost:8080
npm install
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

### Frontend (`frontend/.env.local`, Vercel → Settings → Environment Variables)

| Variable               | Required | Example                              | Purpose |
| ---------------------- | -------- | ------------------------------------ | ------- |
| `NEXT_PUBLIC_SITE_URL` | yes      | `https://luisperalta.vercel.app`     | Canonical URL, Open Graph, sitemap |
| `NEXT_PUBLIC_API_URL`  | yes      | `https://portfolio-api.onrender.com` | API base URL (no trailing slash), used for content and the contact form |
| `API_URL`              | no       | private URL                          | Server-only override for fetching content |

If `NEXT_PUBLIC_API_URL` is unset, the site uses bundled content and the contact form shows a "not connected yet" notice.

### Backend (`backend/.env.example`, Render → Environment)

| Variable              | Default                 | Purpose |
| --------------------- | ----------------------- | ------- |
| `DB_HOST`             | `localhost`             | PostgreSQL host |
| `DB_PORT`             | `5432`                  | PostgreSQL port |
| `DB_NAME`             | `portfolio`             | Database name |
| `DB_USER`             | `portfolio`             | Database user |
| `DB_PASSWORD`         | `portfolio`             | Database password |
| `DB_POOL_SIZE`        | `5`                     | Hikari max pool size |
| `ALLOWED_ORIGINS`     | `http://localhost:3000` | Comma-separated CORS origins (your Vercel domains) |
| `CONTACT_RATE_LIMIT`  | `5`                     | Contact messages allowed per IP per window |
| `CONTACT_GLOBAL_RATE_LIMIT` | `30`              | Contact messages allowed from everyone together per window |
| `CONTACT_RATE_WINDOW` | `PT1H`                  | Rate-limit window (ISO-8601 duration) |
| `PORT`                | `8080`                  | HTTP port (Render sets this) |

## API

All responses are JSON. Errors use [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) `application/problem+json`. Any path not listed below returns `404`.

| Method | Path               | Description |
| ------ | ------------------ | ----------- |
| GET    | `/api/projects`    | Projects in display order (cacheable for 10 minutes) |
| GET    | `/api/skills`      | Skills grouped by category |
| GET    | `/api/experience`  | Experience, most recent first |
| POST   | `/api/contact`     | Submit a contact message (validated, rate-limited, stored) |
| GET    | `/actuator/health` | Health check used by Render |

<details>
<summary>Examples</summary>

```http
GET /api/skills
200 OK
[
  { "category": "BACKEND", "label": "Backend", "skills": ["Java", "Spring Boot", "PostgreSQL", "REST APIs", "JWT", "Docker"] },
  { "category": "FRONTEND", "label": "Frontend", "skills": ["TypeScript", "Next.js", "Tailwind CSS"] },
  { "category": "CLOUD", "label": "Cloud & DevOps", "skills": ["Azure", "Vercel", "Render", "GitHub Actions"] }
]
```

```http
POST /api/contact
Content-Type: application/json

{ "name": "Ada Lovelace", "email": "ada@example.com", "subject": "Backend role", "message": "Hi Luis, ..." }

201 Created
{ "status": "received", "receivedAt": "2026-11-24T14:02:17Z" }
```

```http
400 Bad Request
Content-Type: application/problem+json
{
  "title": "Validation failed",
  "status": 400,
  "detail": "One or more fields are invalid.",
  "errors": { "email": "Email must be a valid address", "message": "Message must be between 10 and 5000 characters" }
}
```

`429 Too Many Requests` (with a `Retry-After` header) is returned when the per-IP limit is exceeded.
</details>

**Contact validation:** name ≤ 100, valid email ≤ 254, subject ≤ 150, message 10–5000 characters. A hidden honeypot field (`website`) quietly drops bot submissions: they get a normal-looking response, but nothing is saved.

**Security:** stateless, no sessions or cookies, so CSRF protection is disabled on purpose. Only the endpoints above are allowed; everything else is denied. CORS is restricted to `ALLOWED_ORIGINS`, and responses carry security headers (CSP `default-src 'none'`, `nosniff`, frame denial). The rate limiter keeps its counts in memory, which is fine for a single instance; with several instances you would move them to a shared store such as Redis.

## Database schema

Managed by Flyway (`backend/src/main/resources/db/migration`). Hibernate runs in `validate` mode: it checks the mapping against the schema but never changes it.

```
projects                    project_technologies
──────────────────────      ───────────────────────────
id            bigint PK ◄── project_id  bigint FK (cascade)
slug          varchar UQ    position    int        PK(project_id, position)
title         varchar       technology  varchar
summary       varchar
description   text          experiences                 experience_highlights
image_url     varchar       ─────────────────────       ─────────────────────────────
github_url    varchar       id           bigint PK ◄─── experience_id bigint FK (cascade)
live_url      varchar       role         varchar        position      int  PK(experience_id, position)
featured      boolean       organization varchar        highlight     varchar
display_order int           location     varchar
                            start_date   date
skills                      end_date     date (null = current)
─────────────────────       summary      text
id            bigint PK
name          varchar       contact_messages
category      varchar       ─────────────────────
  (BACKEND|FRONTEND|CLOUD)  id         bigint PK
display_order int           name       varchar(100)
UQ(category, name)          email      varchar(254)
                            subject    varchar(150)
                            message    text
                            created_at timestamptz (indexed)
```

To read contact messages: `SELECT * FROM contact_messages ORDER BY created_at DESC;` (on Render: database → Connect → PSQL command).

## Deployment

Deploy the API first, because the frontend needs its URL.

### 1. Backend + database on Render

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint** and select the repository. `render.yaml` creates:
   - `portfolio-db`, a PostgreSQL 16 database
   - `portfolio-api`, a Docker web service built from `backend/Dockerfile`, with the database credentials already wired in
3. When prompted, set `ALLOWED_ORIGINS` to `http://localhost:3000` for now.
4. Wait for the deploy, then check `https://<your-service>.onrender.com/actuator/health` → `{"status":"UP"}`.

> Free Render services sleep after about 15 minutes of inactivity, and the first request afterwards takes 30–60 seconds. The site is built for this: pages are pre-rendered, content falls back to the bundled copy, and the contact form explains the wait.

### 2. Frontend on Vercel

1. In Vercel, choose **Add New → Project**, import the repository, and set **Root Directory** to `frontend`.
2. Add the environment variables `NEXT_PUBLIC_SITE_URL` (your Vercel URL) and `NEXT_PUBLIC_API_URL` (your Render URL).
3. Deploy.

### 3. Connect them

In Render, set `ALLOWED_ORIGINS` on `portfolio-api` to your Vercel domain(s), e.g. `https://luisperalta.vercel.app,https://www.yourdomain.com`. Saving restarts the service. Then send yourself a test message through the contact form.

If you add a custom domain later, update `NEXT_PUBLIC_SITE_URL` on Vercel and `ALLOWED_ORIGINS` on Render.

## Editing content

| What | Where |
| ---- | ----- |
| Name, headline, links (email, LinkedIn), bio, focus areas | `frontend/src/content/profile.ts` |
| Education, certifications, languages | `frontend/src/content/education.ts` |
| Architecture diagrams | `frontend/src/content/architecture.ts` |
| Projects, skills, experience (live data) | a **new** Flyway migration, e.g. `backend/.../db/migration/V3__update_projects.sql` |
| Fallback copies of the live data | `frontend/src/content/{projects,skills,experience}.ts` |
| Resume | `frontend/public/resume.pdf` (the Resume buttons appear automatically) |
| Project screenshots | `frontend/public/projects/<name>.png`, then set `image_url = '/projects/<name>.png'` |

Empty links (for example LinkedIn) are hidden automatically. Never edit an applied migration, because Flyway verifies checksums; add a new one instead.

## Quality checks

```bash
# Backend: unit + integration tests against a real (embedded) PostgreSQL
cd backend && ./mvnw verify

# Frontend
cd frontend && npm run lint && npm run typecheck && npm run build
```

The integration tests cover Flyway migrations, Hibernate schema validation, all endpoints, validation errors, the honeypot, rate limiting, CORS and the deny-by-default security rules. CI runs everything on every push and pull request.
