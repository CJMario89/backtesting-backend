import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CandlesModule } from './candles/candles.modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'src/data-source';
import { BacktestModule } from './backtest/backtest.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    CandlesModule,
    BacktestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
