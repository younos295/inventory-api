<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

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
- NestJS, TypeScript, PostgreSQL (Supabase/Neon), TypeORM
- JWT authentication
- Swagger API docs

---


## Setup Instructions

1. Clone the repository:
  ```bash
  git clone <your-github-repo-url>
  cd inventory-api
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Configure environment variables in a `.env` file:
  ```env
  DB_HOST=your-db-host
  DB_PORT=5432
  DB_USERNAME=your-db-username
  DB_PASSWORD=your-db-password
  DB_DATABASE=your-db-name
  JWT_SECRET=your-jwt-secret
  ```
4. Run database migrations (if using TypeORM CLI):
  ```bash
  npm run typeorm migration:run
  ```
5. Start the server:
  ```bash
  npm run start:dev
  ```

## API Documentation

Swagger UI is available at: `http://localhost:3000/api/docs`

## Live Demo

- **Backend:** [Your Render/Vercel/Railway URL here]
- **Database:** [Your Supabase/Neon URL here]

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


## Deployment & Hosting

You can deploy the backend on Render, Vercel, or Railway (free tier). Host the PostgreSQL database on Supabase or Neon (free tier). Make sure both are publicly accessible.

---


## License

MIT
