import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { BacktestService } from './backtest.service';
import { BackTestInputDto, Signal } from './backtest.type';

@Controller()
export class BacktestController {
  constructor(private readonly backtestService: BacktestService) {}

  @Post('backtest')
  async postBacktest(@Body() body: BackTestInputDto, @Res() res: Response) {
    const {
      symbol,
      interval,
      start,
      end,
      capital,
      takeProfit,
      stopLoss,
      buySignals,
      sellSignals,
    } = body;
    // console.log(buySignals[0][0].upperBound);
    const result = await this.backtestService.postBackTesting({
      symbol: symbol as string,
      interval: interval as string,
      start: start as string,
      end: end as string,
      capital: capital as number,
      takeProfit: takeProfit as number,
      stopLoss: stopLoss as number,
      buySignals: buySignals as Signal[][],
      sellSignals: sellSignals as Signal[][],
    });
    return res.json(result);
  }
}
