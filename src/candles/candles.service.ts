import { Candle, getCandleDto } from './candles.type';

import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

import { EntityManager } from 'typeorm';
import { AppDataSource } from 'src/data-source';
const candleNumber = 3000;

@Injectable()
export class CandlesService {
  constructor(
    @InjectEntityManager(AppDataSource)
    private readonly entityManager: EntityManager,
  ) {}

  async getCandles({
    interval,
    symbol,
    page,
  }: getCandleDto): Promise<Candle[]> {
    if (typeof interval === undefined) {
      throw 'No interval provided';
    }

    if (typeof symbol === undefined) {
      throw 'No symbol provided';
    }

    if (typeof page === undefined) {
      throw 'No page provided';
    }

    const data = await this.entityManager.query(
      `
      SELECT 
        "openTime",
        "open",
        "high",
        "low",
        "close",
        "volume"
      FROM ${symbol}_${interval}
      ORDER BY "openTime" DESC
      LIMIT ${candleNumber}
      OFFSET ${(parseInt(page) - 1) * candleNumber}`,
    );

    return data
      .map((candle) => ({
        time: Number(candle.openTime) / 1000,
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close),
        volume: Number(candle.volume),
      }))
      .reverse();
  }
}
