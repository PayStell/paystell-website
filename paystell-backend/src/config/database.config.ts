import { DataSourceOptions } from 'typeorm';
import { WalletVerification } from '../modules/wallet/entities/WalletVerification';
import { User } from '../modules/user/entities/User';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'paystell',
  entities: [User, WalletVerification],
  synchronize: !isProduction,
  logging: !isProduction,
  migrations: ['src/migrations/**/*.ts'],
  ssl: process.env.DB_SSL === 'true'
    ? {
        rejectUnauthorized: false,
      }
    : false,
};

export default dbConfig;
