import { PrismaService } from 'src/prisma/prisma-service';
import { Candle, getCandleDto } from './candles.type';

import { Injectable } from '@nestjs/common';
const candleNumber = 3000;

@Injectable()
export class CandlesService {
  constructor(private prisma: PrismaService) {}

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

    const data = (await this.prisma.$queryRawUnsafe(`
      SELECT 
        "time",
        "open",
        "high",
        "low",
        "close",
        "volume"
      FROM ${symbol}_${interval}
      ORDER BY "time" DESC
      LIMIT ${candleNumber}
      OFFSET ${(parseInt(page) - 1) * candleNumber}`)) as any[];
    return data
      .map((candle) => ({
        time: Number(candle.time) / 1000,
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close),
        volume: Number(candle.volume),
      }))
      .reverse();
  }
}
