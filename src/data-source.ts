import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  Btcusdt_1mon,
  Btcusdt_1m,
  Btcusdt_3m,
  Btcusdt_5m,
  Btcusdt_15m,
  Btcusdt_30m,
  Btcusdt_1h,
  Btcusdt_2h,
  Btcusdt_4h,
  Btcusdt_6h,
  Btcusdt_8h,
  Btcusdt_12h,
  Btcusdt_1d,
  Btcusdt_3d,
  Btcusdt_1w,
} from './entities/btcusdt';

export const databaseConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'cjmario',
  password: 'cjmario',
  database: 'blockchain',
  synchronize: false,
  logging: false,
} as DataSourceOptions;

export const AppDataSource = new DataSource({
  ...databaseConfig,
  entities: [
    Btcusdt_1m,
    Btcusdt_3m,
    Btcusdt_5m,
    Btcusdt_15m,
    Btcusdt_30m,
    Btcusdt_1h,
    Btcusdt_2h,
    Btcusdt_4h,
    Btcusdt_6h,
    Btcusdt_8h,
    Btcusdt_12h,
    Btcusdt_1d,
    Btcusdt_3d,
    Btcusdt_1w,
    Btcusdt_1mon,
  ],
  migrations: [],
  subscribers: [],
});
