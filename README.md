# osu-ee-tracker

A full-stack osu! tracker application with a Next.js frontend and a NestJS backend powered by Prisma and PostgreSQL.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Next.js (TypeScript, Tailwind CSS) |
| Backend  | NestJS (TypeScript)               |
| ORM      | Prisma                            |
| Database | PostgreSQL                        |

---

## Project Structure

```
osu-ee-tracker
├── client/         # Next.js frontend
└── server/         # NestJS backend
```

---

## Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (running locally or via a cloud provider)

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd osu-ee-tracker
```

---

### 2. Set up the backend (NestJS)

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/osu_ee_tracker"
```

Replace `USER`, `PASSWORD`, and the database name as needed.

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate deploy
```

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000` by default.

---

### 3. Set up the frontend (Next.js)

```bash
cd ../client
npm install
```

Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Adjust the URL if your backend runs on a different port.

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3001` (or the next available port).

---

## Running Both Servers

You can open two terminal windows and run each server independently:

**Terminal 1 — Backend:**
```bash
cd server
npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Alternatively, from the root you can use the root-level `package.json` scripts if configured.

---

## Database

This project uses **Prisma** with **PostgreSQL**. Migration files are stored in `server/prisma/migrations/`.

Useful commands (run from `server/`):

```bash
# Apply all pending migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate
```

---

## Scripts

### Server (`server/`)

| Command               | Description                          |
|-----------------------|--------------------------------------|
| `npm run start:dev`   | Start in watch/dev mode              |
| `npm run start:prod`  | Start in production mode             |
| `npm run build`       | Compile TypeScript                   |
| `npm run test`        | Run unit tests                       |
| `npm run test:e2e`    | Run end-to-end tests                 |
| `npm run lint`        | Lint the codebase                    |

### Client (`client/`)

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start Next.js dev server             |
| `npm run build`  | Build for production                 |
| `npm run start`  | Start production build               |
| `npm run lint`   | Lint the codebase                    |

```
osu-ee-tracker
├─ client
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ eslint.config.mjs
│  ├─ lib
│  │  ├─ api.ts
│  │  └─ types.ts
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  └─ tsconfig.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ server
   ├─ .prettierrc
   ├─ eslint.config.mjs
   ├─ nest-cli.json
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260430140409_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501084523_add_score
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501122445_init_clean
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501130020_make_rank_optional
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501132540_refactor
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  └─ schema.prisma
   ├─ prisma.config.ts
   ├─ README.md
   ├─ src
   │  ├─ app.controller.spec.ts
   │  ├─ app.controller.ts
   │  ├─ app.module.ts
   │  ├─ app.service.ts
   │  ├─ dto
   │  │  └─ create-score.dto.ts
   │  ├─ leaderboard-query.dto.ts
   │  ├─ main.ts
   │  ├─ players.controller.ts
   │  ├─ players.service.ts
   │  ├─ prisma.service.ts
   │  ├─ scores.controller.ts
   │  ├─ scores.service.ts
   │  └─ time-range.util.ts
   ├─ test
   │  ├─ app.e2e-spec.ts
   │  └─ jest-e2e.json
   ├─ tsconfig.build.json
   └─ tsconfig.json

```
```
osu-ee-tracker
├─ client
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ eslint.config.mjs
│  ├─ lib
│  │  ├─ api.ts
│  │  └─ types.ts
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  └─ tsconfig.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ server
   ├─ .prettierrc
   ├─ eslint.config.mjs
   ├─ nest-cli.json
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260430140409_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501084523_add_score
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501122445_init_clean
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501130020_make_rank_optional
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501132540_refactor
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  └─ schema.prisma
   ├─ prisma.config.ts
   ├─ README.md
   ├─ src
   │  ├─ app.controller.spec.ts
   │  ├─ app.controller.ts
   │  ├─ app.module.ts
   │  ├─ app.service.ts
   │  ├─ common
   │  │  ├─ dto
   │  │  │  ├─ create-score.dto.ts
   │  │  │  └─ leaderboard-query.dto.ts
   │  │  └─ utils
   │  │     └─ time-range.util.ts
   │  ├─ main.ts
   │  ├─ modules
   │  │  ├─ osu
   │  │  │  ├─ osu.module.ts
   │  │  │  └─ osu.service.ts
   │  │  ├─ players
   │  │  │  ├─ players.controller.ts
   │  │  │  ├─ players.module.ts
   │  │  │  └─ players.service.ts
   │  │  ├─ polling
   │  │  │  ├─ polling.module.ts
   │  │  │  └─ polling.service.ts
   │  │  └─ scores
   │  │     ├─ scores.controller.ts
   │  │     ├─ scores.modules.ts
   │  │     └─ scores.service.ts
   │  └─ prisma
   │     └─ prisma.service.ts
   ├─ test
   │  ├─ app.e2e-spec.ts
   │  └─ jest-e2e.json
   ├─ tsconfig.build.json
   └─ tsconfig.json

```
```
osu-ee-tracker
├─ client
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ eslint.config.mjs
│  ├─ lib
│  │  ├─ api.ts
│  │  └─ types.ts
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  └─ tsconfig.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ server
   ├─ .prettierrc
   ├─ eslint.config.mjs
   ├─ nest-cli.json
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260430140409_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501084523_add_score
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501122445_init_clean
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501130020_make_rank_optional
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501132540_refactor
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  └─ schema.prisma
   ├─ prisma.config.ts
   ├─ README.md
   ├─ src
   │  ├─ app.controller.spec.ts
   │  ├─ app.controller.ts
   │  ├─ app.module.ts
   │  ├─ app.service.ts
   │  ├─ common
   │  │  ├─ dto
   │  │  │  ├─ create-score.dto.ts
   │  │  │  └─ leaderboard-query.dto.ts
   │  │  └─ utils
   │  │     └─ time-range.util.ts
   │  ├─ main.ts
   │  ├─ modules
   │  │  ├─ osu
   │  │  │  ├─ osu.module.ts
   │  │  │  └─ osu.service.ts
   │  │  ├─ players
   │  │  │  ├─ players.controller.ts
   │  │  │  ├─ players.module.ts
   │  │  │  └─ players.service.ts
   │  │  ├─ polling
   │  │  │  ├─ polling.module.ts
   │  │  │  └─ polling.service.ts
   │  │  └─ scores
   │  │     ├─ scores.controller.ts
   │  │     ├─ scores.modules.ts
   │  │     └─ scores.service.ts
   │  └─ prisma
   │     └─ prisma.service.ts
   ├─ test
   │  ├─ app.e2e-spec.ts
   │  └─ jest-e2e.json
   ├─ tsconfig.build.json
   └─ tsconfig.json

```
```
osu-ee-tracker
├─ client
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ eslint.config.mjs
│  ├─ lib
│  │  ├─ api.ts
│  │  └─ types.ts
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  └─ tsconfig.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ server
   ├─ .prettierrc
   ├─ eslint.config.mjs
   ├─ nest-cli.json
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260430140409_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501084523_add_score
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501122445_init_clean
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501130020_make_rank_optional
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501132540_refactor
   │  │  │  └─ migration.sql
   │  │  ├─ 20260506152256_test1
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  └─ schema.prisma
   ├─ prisma.config.ts
   ├─ README.md
   ├─ src
   │  ├─ app.controller.spec.ts
   │  ├─ app.controller.ts
   │  ├─ app.module.ts
   │  ├─ app.service.ts
   │  ├─ common
   │  │  ├─ dto
   │  │  │  ├─ create-score.dto.ts
   │  │  │  └─ leaderboard-query.dto.ts
   │  │  └─ utils
   │  │     └─ time-range.util.ts
   │  ├─ main.ts
   │  ├─ modules
   │  │  ├─ osu
   │  │  │  ├─ osu.module.ts
   │  │  │  └─ osu.service.ts
   │  │  ├─ players
   │  │  │  ├─ players.controller.ts
   │  │  │  ├─ players.module.ts
   │  │  │  └─ players.service.ts
   │  │  ├─ polling
   │  │  │  ├─ osu-api.service.ts
   │  │  │  ├─ osu-api.types.ts
   │  │  │  ├─ polling.module.ts
   │  │  │  └─ polling.service.ts
   │  │  └─ scores
   │  │     ├─ scores.controller.ts
   │  │     ├─ scores.module.ts
   │  │     └─ scores.service.ts
   │  └─ prisma
   │     └─ prisma.service.ts
   ├─ test
   │  ├─ app.e2e-spec.ts
   │  └─ jest-e2e.json
   ├─ tsconfig.build.json
   └─ tsconfig.json

```
```
osu-ee-tracker
├─ client
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ eslint.config.mjs
│  ├─ lib
│  │  ├─ api.ts
│  │  └─ types.ts
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  └─ tsconfig.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ server
   ├─ .prettierrc
   ├─ eslint.config.mjs
   ├─ nest-cli.json
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260430140409_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501084523_add_score
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501122445_init_clean
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501130020_make_rank_optional
   │  │  │  └─ migration.sql
   │  │  ├─ 20260501132540_refactor
   │  │  │  └─ migration.sql
   │  │  ├─ 20260506152256_test1
   │  │  │  └─ migration.sql
   │  │  ├─ 20260506155917_remove_rank
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  └─ schema.prisma
   ├─ prisma.config.ts
   ├─ README.md
   ├─ src
   │  ├─ app.controller.spec.ts
   │  ├─ app.controller.ts
   │  ├─ app.module.ts
   │  ├─ app.service.ts
   │  ├─ common
   │  │  ├─ dto
   │  │  │  ├─ create-score.dto.ts
   │  │  │  └─ leaderboard-query.dto.ts
   │  │  └─ utils
   │  │     └─ time-range.util.ts
   │  ├─ main.ts
   │  ├─ modules
   │  │  ├─ beatmaps
   │  │  ├─ osu
   │  │  │  ├─ osu.module.ts
   │  │  │  └─ osu.service.ts
   │  │  ├─ players
   │  │  │  ├─ players.controller.ts
   │  │  │  ├─ players.module.ts
   │  │  │  └─ players.service.ts
   │  │  ├─ polling
   │  │  │  ├─ osu-api.service.ts
   │  │  │  ├─ osu-api.types.ts
   │  │  │  ├─ polling.module.ts
   │  │  │  └─ polling.service.ts
   │  │  └─ scores
   │  │     ├─ scores.controller.ts
   │  │     ├─ scores.module.ts
   │  │     └─ scores.service.ts
   │  └─ prisma
   │     └─ prisma.service.ts
   ├─ test
   │  ├─ app.e2e-spec.ts
   │  └─ jest-e2e.json
   ├─ tsconfig.build.json
   └─ tsconfig.json

```