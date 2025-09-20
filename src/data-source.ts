import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './auth/user.entity';
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';

const isProd = process.env.NODE_ENV === 'production';
// Ensure env vars are loaded when running TypeORM CLI directly (local/dev only)
if (!isProd) {
  dotenv.config({ path: '.env' });
}

const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      }),
  entities: [User, Category, Product],
  migrations: [isProd ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],
  ssl: isProd ? { rejectUnauthorized: false } : false,
  synchronize: false,
});

export default AppDataSource;
