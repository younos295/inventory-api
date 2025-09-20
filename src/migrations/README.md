This directory stores TypeORM migration files.

- Development migrations are generated as TypeScript in `src/migrations/*.ts`.
- Production migrations (after `npm run build`) are compiled to `dist/migrations/*.js`.

Useful scripts:
- Generate: `npm run migration:generate --name <Name>`
- Run (dev): `npm run migration:run`
- Run (prod/after build): `npm run migration:run:prod`
