 
## E-Commerce Inventory API

This project is a RESTful API for an e-commerce inventory system built with NestJS, TypeScript, and PostgreSQL. It supports secure CRUD operations for products and categories, JWT-based user authentication, and product search. Optionally, product images can be uploaded and stored.

### Features
- User registration and login (JWT authentication)
- CRUD for products and categories
- Product filters (category, price range, pagination)
- Product search by name/description
- Category product count
- Protected endpoints (JWT)
- API documentation with Swagger
- Optional: Product image upload

### Tech Stack
- NestJS, TypeScript, PostgreSQL (Neon), TypeORM
- JWT authentication
- Swagger API docs

---


## Setup Instructions

1. Clone the repository:
  ```bash
  git clone https://github.com/younos295/inventory-api
  cd inventory-api
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Configure environment variables and local database:
   - See [Local DB Setup Guide](docs/SETUP.md) for detailed instructions on creating the Postgres user, database, and running migrations.
4. Configure environment variables

  Local (.env):
  ```env
  # Option A: connection params
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=user
  DB_PASSWORD=admin123
  DB_DATABASE=inventory

  # Option B: single URL (overrides the above if set)
  # DATABASE_URL=postgres://user:admin123@localhost:5432/inventory

  # Auth
  JWT_SECRET=your-access-token-secret
  JWT_REFRESH_SECRET=your-refresh-token-secret
  JWT_ACCESS_EXPIRES=60m
  JWT_REFRESH_EXPIRES=7d

  # App
  PORT=8080
  NODE_ENV=development
  ```

  **Note:** 5432 is the default PostgreSQL port on most systems. If your local PostgreSQL runs on a different port, update `DB_PORT` (and the `DATABASE_URL` example) accordingly.

  Hosted (Render env vars):
  - Set `DATABASE_URL` to your Neon connection string (with SSL), e.g. `postgres://user:pass@host/neondb?sslmode=require`
  - Set `JWT_SECRET` and `JWT_REFRESH_SECRET`
  - Render sets `PORT` automatically; you may still set it explicitly if desired
  - `NODE_ENV=production` (Render sets this by default)

5. Run database migrations
  ```bash
  # Local/dev
  npm run migration:run

  # Show migrations
  npm run migration:show

  # Production (after build)
  npm run build && npm run migration:run:prod
  ```

6. Start the server
  ```bash
  # Development (watch mode)
  npm run start:dev

  # Production (assumes migrations already run)
  npm run start:prod

  # Production with auto-migration then start (useful on Render)
  npm run start:prod:migrate
  ```

## API Documentation

Swagger UI is available at: `http://localhost:8080/api/docs`

## Live Demo

- **Backend (Render):** https://inventory-api-9nao.onrender.com/api
- **Swagger (hosted):** https://inventory-api-9nao.onrender.com/api/docs
---


## Usage

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Products
- `POST /api/products` — Create product
- `GET /api/products` — List products (filters: categoryId, minPrice, maxPrice, page, limit)
- `GET /api/products/:id` — Get product by ID
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product
- `GET /api/products/search?q=keyword` — Search products

### Categories
- `POST /api/categories` — Create category
- `GET /api/categories` — List categories (with product count)
- `GET /api/categories/:id` — Get category by ID
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category (only if no linked products)

---

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Deployment & Hosting (Render + Neon)

Follow these steps to deploy the API on Render and host the PostgreSQL database on Neon.

1. Create a Neon database
   - Create a Neon project and database
   - Copy the connection string (include `?sslmode=require`)
   - Optionally create a non-superuser for the app

2. Prepare the repo for production
   - Ensure migrations are generated and committed
   - Confirm `src/data-source.ts` and `src/app.module.ts` read `DATABASE_URL` in production and enable SSL

3. Create a Render Web Service
   - Connect your GitHub repo
   - Environment: Node
   - Build Command: `npm install; npm run build`
   - Start Command: `npm run start:prod:migrate`
   - Add Environment Variables:
     - `DATABASE_URL=postgres://user:pass@host/db?sslmode=require`
     - `JWT_SECRET=your-access-secret`
     - `JWT_REFRESH_SECRET=your-refresh-secret`
     - (Optional) `PORT=8080` (Render sets this automatically)

4. Run migrations in production
   - Render Start Command uses `npm run start:prod:migrate` which runs migrations before the app boots

5. Verify
   - Open the Render URL: `https://your-render-service.onrender.com/api/docs` (Swagger)
   - Test `POST /api/auth/register` and `POST /api/auth/login`

Notes
- In production (`NODE_ENV=production`), `synchronize` is disabled and SSL is enabled per `src/app.module.ts` and `src/data-source.ts`
- Prefer `DATABASE_URL` in production; local can use either connection params or `DATABASE_URL`

---


## License

MIT
