# Inventory API – Local DB Setup Guide (Windows/macOS/Linux)

This guide walks you through setting up the project on a new machine. It covers prerequisites, environment variables, database setup, running migrations, and starting the server.

The app uses:
- NestJS + TypeScript
- PostgreSQL + TypeORM
- JWT auth

Repo structure references:
- `package.json` scripts (build/start/migrations)
- `.env.example` and `.env.production.example` for configuration templates

---

## 1) Prerequisites

- Node.js LTS (v18 or v20 recommended)
- npm (bundled with Node.js)
- Git
- PostgreSQL 14+ (local or hosted)

Optional but recommended:
- cURL or HTTP client (Insomnia/Postman)
- A terminal with Bash/Zsh (Windows users may prefer PowerShell or WSL)

### Windows
- Install Node.js LTS: https://nodejs.org/
- Install Git: https://git-scm.com/download/win
- Install PostgreSQL: https://www.postgresql.org/download/windows/
- If you encounter native module build issues (e.g., `bcrypt`), install Build Tools:
  - Open an elevated PowerShell and run: `npm install --global --production windows-build-tools` (for older setups), or install Visual Studio Build Tools: https://visualstudio.microsoft.com/visual-cpp-build-tools/

### macOS
- Install Homebrew: https://brew.sh/
- Install Node.js LTS: `brew install node`
- Install PostgreSQL: `brew install postgresql@14` (or newer)
- Start PostgreSQL service: `brew services start postgresql@14`

### Ubuntu/Debian Linux
- Node.js LTS:
  - `sudo apt-get update`
  - `sudo apt-get install -y ca-certificates curl gnupg`
  - Install via NodeSource or nvm (recommended): https://github.com/nvm-sh/nvm
- PostgreSQL:
  - `sudo apt-get install -y postgresql postgresql-contrib`
  - Ensure service is running: `sudo service postgresql start`

---

## 2) Clone and install

```bash
git clone https://github.com/younos295/inventory-api
cd inventory-api
npm install
```

If you see peer dependency warnings from ESLint/TypeScript, they can generally be ignored for runtime. Dev tasks (lint/tests) will still work.

---

## 3) Environment variables

Create a `.env` file in the project root (next to `package.json`). Use `.env.example` as a reference.

Minimum required variables (from `.env.example`):

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=admin123
DB_DATABASE=inventory
PORT=8080
JWT_SECRET=some-long-random-secret
DATABASE_URL=postgres://user:admin123@localhost:5432/inventory

JWT_ACCESS_EXPIRES=60m
JWT_REFRESH_EXPIRES=7d
```

Notes:
- Default Postgres port is `5432` and this project’s example uses `5432`.
- If your local Postgres runs on a different port, update `DB_PORT` and the `DATABASE_URL` example accordingly.
- `DATABASE_URL` should match the individual DB_* values.
- Use a strong `JWT_SECRET` in all environments.

---

## 4) Database setup

You can use a local PostgreSQL instance or a hosted one (e.g., Supabase/Neon). The examples below are for local setups.

### Create user and database (PostgreSQL)

Adjust the values to match your `.env`.

- macOS/Linux (psql):
```bash
# Enter the Postgres shell (use your system's method)
sudo -u postgres psql   # Ubuntu/Debian
# or simply: psql       # if your user has access

-- In psql, run:
CREATE ROLE "user" WITH LOGIN PASSWORD 'admin123';
ALTER ROLE "user" CREATEDB;
CREATE DATABASE inventory OWNER "user";
GRANT ALL PRIVILEGES ON DATABASE inventory TO "user";
\q
```

- Windows (psql via PgAdmin or Command Prompt):
  - Open SQL query tool and run the same SQL statements above.

If your Postgres uses a different port, update both `.env` and your `DATABASE_URL` accordingly.

---

## 5) Build and run migrations

This project uses TypeORM migrations. Ensure your `.env` is correct before running them.

- Generate a new migration (if needed during development):
```bash
npm run migration:generate --name=<YourMigrationName>
```

- Run migrations (development):
```bash
npm run migration:run
```

- Revert last migration (if needed):
```bash
npm run migration:revert
```

- Show migrations:
```bash
npm run migration:show
```

For production builds, the project also provides:
```bash
npm run build
npm run start:prod:migrate   # runs dist migrations then starts app
```

---

## 6) Start the server

- Development (watch mode):
```bash
npm run start:dev
```

- Production (after `npm run build`):
```bash
npm run start:prod
```

The server listens on `http://localhost:8080` by default (from `.env`).

Swagger docs: `http://localhost:8080/api/docs`

---

## 7) Verify health

- You should see NestJS startup logs in the terminal.
- Visit the Swagger URL to explore endpoints.
- Use your HTTP client to hit auth, products, and categories endpoints.

---

## 8) Running tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

---

## 9) Troubleshooting

- Port conflicts (DB or API):
  - If Postgres uses `5432`, but your `.env` has `5433`, update `.env` or change Postgres config.
  - If `PORT=8080` is in use, change `PORT` in `.env`.

- PostgreSQL auth errors:
  - Ensure the role, password, and database exist and match `.env`.
  - Verify `pg_hba.conf` allows local connections (for local Postgres installs).

- `bcrypt` installation issues on Windows:
  - Ensure Node.js LTS and Visual C++ Build Tools are installed.
  - Try deleting `node_modules` and reinstalling: `rm -rf node_modules package-lock.json && npm install`.

- Migrations don’t run or entities not found:
  - Ensure `src/data-source.ts` points to the correct entities and migrations paths.
  - Confirm environment variables are loaded (use `console.log(process.env.DB_HOST)` temporarily if needed).

---

## 10) Production notes

- Use `.env.production` values similar to `.env.production.example` and strong secrets.
- Ensure the database is reachable from your hosting provider.
- On Render (see `render.yaml`):
  - Build: `npm install --include=dev && npm run build`
  - Start: `npm run start:prod`
  - Run migrations before start or use `start:prod:migrate` pattern if your platform supports it.

---

## 11) Quick start (copy-paste)

```bash
# 1) Clone and install
git clone https://github.com/younos295/inventory-api
cd inventory-api
npm install

# 2) Create .env (adjust as needed)
cp .env.example .env   # macOS/Linux
# On Windows PowerShell: Copy-Item .env.example .env

# 3) Ensure Postgres is running and DB/user exist
# (see section 4 for SQL commands)

# 4) Run migrations
npm run migration:run

# 5) Start dev server
npm run start:dev
# Open http://localhost:8080/api/docs
```
