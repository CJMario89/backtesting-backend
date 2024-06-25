import { Controller, Get, Req, Res } from '@nestjs/common';
import { CandlesService } from './candles.service';
import { Interval } from './candles.type';
import { Request, Response } from 'express';

@Controller()
export class CandlesController {
  constructor(private readonly candleService: CandlesService) {}

  @Get('candles')
  async getCandles(@Req() req: Request, @Res() res: Response) {
    const { interval, symbol, page } = req.query;
    const candles = await this.candleService.getCandles({
      interval: interval as Interval,
      symbol: symbol as string,
      page: page as string,
    });
    return res.json(candles);
  }
}
