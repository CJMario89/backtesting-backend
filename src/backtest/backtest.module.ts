import { Module } from '@nestjs/common';
import { BacktestService } from './backtest.service';
import { BacktestController } from './backtest.controller';

@Module({
  imports: [],
  controllers: [BacktestController],
  providers: [BacktestService],
})
export class BacktestModule {}
