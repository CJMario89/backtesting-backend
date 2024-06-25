import { Injectable } from '@nestjs/common';
// import {
//   BackTestInputDto,
//   BackTestOutput,
//   Indicator,
//   Signal,
//   Trade,
// } from './backtest.type';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  BackTestInputDto,
  BackTestOutput,
  Indicator,
  Signal,
  Trade,
} from './backtest.type.js';
import { AppDataSource } from 'src/data-source';
import { Candle } from 'src/candles/candles.type';

@Injectable()
export class BacktestService {
  private tradingSignals = {};
  public SignalsMap = {};
  constructor(
    @InjectEntityManager(AppDataSource)
    private readonly entityManager: EntityManager,
  ) {
    (async () => {
      const TradingSignals = await import('trading-signals');

      const SignalsMap = {
        rsi: TradingSignals.FasterRSI,
        ema: TradingSignals.FasterEMA,
        sma: TradingSignals.FasterSMA,
      };
      type Signals =
        | typeof TradingSignals.FasterRSI
        | typeof TradingSignals.FasterEMA
        | typeof TradingSignals.FasterSMA;
      type SingalNames = keyof typeof SignalsMap;
      this.SignalsMap = SignalsMap as Record<SingalNames, Signals>;
    })();
  }

  async postBackTesting({
    symbol,
    interval,
    start,
    end,
    buySignals,
    sellSignals,
  }: BackTestInputDto): Promise<BackTestOutput> {
    const capital = 10000;
    const candles: Candle[] = await this.entityManager.query(
      `
      SELECT 
        "openTime",
        "open",
        "high",
        "low",
        "close",
        "volume"
      FROM "${symbol}_${interval}"
      WHERE "openTime" >= '${start}' AND "openTime" <= '${end}'`,
    );
    console.log(start, end, candles.length, interval);
    console.log(candles);
    this.setTradeSignals({
      buySignals,
      sellSignals,
    });
    const { trades, totalProfit, maxDrawdown } = this.getBackTestResult({
      candles,
      buySignals,
      sellSignals,
      capital,
    });

    // const totalProfit = trades.reduce((acc, trade) => acc + trade.profit, 0);
    const totalDuration = trades.reduce(
      (acc, trade) => acc + trade.duration,
      0,
    );
    // const totalMaxDrawdown = Math.max(
    //   ...trades.map((trade) => trade.maxDrawdown),
    // );
    const profitRate = totalProfit / capital;
    const totalYears = totalDuration / (1000 * 60 * 60 * 24 * 365);
    const annualizedReturn = Math.pow(1 + profitRate, 1 / totalYears) - 1;
    return {
      startTime: start,
      endTime: end,
      initailCaptial: capital,
      capital: capital + totalProfit,
      buySellCandlesPairs: trades,
      totalProfit,
      totalDuration,
      totalMaxDrawdown: maxDrawdown,
      profitRate,
      annualizedReturn,
    };
  }

  getBackTestResult({
    candles,
    buySignals,
    sellSignals,
    capital,
  }: {
    candles: Candle[];
    buySignals: Signal[][];
    sellSignals: Signal[][];
    capital: number;
  }): { trades: Trade[]; totalProfit: number; maxDrawdown: number } {
    const trades: Trade[] = [];
    const trade: Trade = {
      buy: null,
      sell: null,
      profit: 0,
      percentProfit: 0,
      capital,
      duration: 0,
      maxDrawdown: 0,
    };
    let totalProfit = 0;
    let maxDrawdown = 0;
    let hasPosition = false;

    candles.forEach((candle, index) => {
      let shouldBuy = false;
      let shouldSell = false;
      const _buySignals = [];
      const _sellSignals = [];
      //input signal.upperBound, signal.lowerBound, signal-logic(and or), currentValue, then return shouldBuy
      // signals => shouldBuy
      buySignals.forEach((signals) => {
        let shouldBuySignal = true;
        signals.forEach((signal) => {
          //should before update currentValue
          const upperBound = this.getBoundValue('upperBound', signal, candle);
          const lowerBound = this.getBoundValue('lowerBound', signal, candle);
          const currentValue = this.tradingSignals[signal.id].update(
            candle.close,
          );
          if (
            typeof currentValue === 'undefined' ||
            typeof upperBound === 'undefined' ||
            typeof lowerBound === 'undefined'
          ) {
            shouldBuySignal = false; //can't buy
          }
          if (currentValue > upperBound || currentValue < lowerBound) {
            shouldBuySignal = false; //can't buy
          }
          // console.log(
          //   'buy',
          //   candle.close,
          //   lowerBound,
          //   currentValue,
          //   upperBound,
          //   shouldBuySignal,
          // );
        });
        if (shouldBuySignal) {
          shouldBuy = true;
          _buySignals.push(signals);
        }
      });

      // signals => shouldSell
      sellSignals.forEach((signals) => {
        let shouldSellSignal = true;
        signals.forEach((signal) => {
          const upperBound = this.getBoundValue('upperBound', signal, candle);
          const lowerBound = this.getBoundValue('lowerBound', signal, candle);
          const currentValue = this.tradingSignals[signal.id].update(
            candle.close,
          );
          if (
            typeof currentValue === undefined ||
            typeof upperBound === undefined ||
            typeof lowerBound === undefined
          ) {
            shouldSellSignal = false; //one of signals fail,then it can't sell
          }
          if (currentValue > upperBound || currentValue < lowerBound) {
            shouldSellSignal = false; //one of signals fail,then it can't sell
          }
          // console.log(
          //   'sell',
          //   candle.close,
          //   lowerBound,
          //   currentValue,
          //   upperBound,
          //   shouldSellSignal,
          // );
        });
        if (shouldSellSignal) {
          shouldSell = true;
          _sellSignals.push(signals);
        }
      });

      if (hasPosition) {
        const drawdown =
          ((Number(candle.close) - Number(trade.buy.close)) /
            Number(trade.buy.close)) *
          100;
        // console.log(trade.capital, currentProfit, maxDrawdown);
        if (drawdown < maxDrawdown) {
          maxDrawdown = drawdown;
          trade.maxDrawdown = maxDrawdown;
        }
      }
      // console.log(index);
      // console.log(hasPosition);
      // console.log(shouldBuy);
      // console.log(candle.close);
      if (shouldBuy && !hasPosition) {
        trade.buy = candle;
        trade.buySignals = _buySignals;
        hasPosition = true;
      } else if (shouldSell && hasPosition) {
        trade.sell = candle;
        trade.sellSignals = _sellSignals;
        trade.percentProfit =
          (Number(trade.sell.close) - Number(trade.buy.close)) /
          Number(trade.buy.close);
        trade.profit = trade.capital * trade.percentProfit;
        trade.capital = trade.capital + trade.profit;
        trade.duration =
          Number(trade.sell.openTime) - Number(trade.buy.openTime);
        trades.push({ ...trade });
        hasPosition = false;
        totalProfit += trade.profit;
      }
      if (index === candles.length - 1 && hasPosition) {
        trade.sell = candle;
        trade.sellSignals = _sellSignals;
        trade.percentProfit =
          (Number(trade.sell.close) - Number(trade.buy.close)) /
          Number(trade.buy.close);
        trade.profit = trade.capital * trade.percentProfit;
        trade.capital = trade.capital + trade.profit;
        trade.duration =
          Number(trade.sell.openTime) - Number(trade.buy.openTime);
        trades.push({ ...trade });
        hasPosition = false;
        totalProfit += trade.profit;
      }
    });
    return {
      trades,
      totalProfit,
      maxDrawdown,
    };
  }

  // value: 0, 'previous', Indicator
  getBoundValue(
    bound: 'upperBound' | 'lowerBound',
    signal: Signal,
    candle: Candle,
  ) {
    const boundValue: number | string | Indicator = signal[bound].value;
    if (typeof boundValue === 'number') {
      // max or number
      return boundValue;
    } else if (boundValue === 'previous') {
      try {
        return this.getTradingSignal(signal.id).getResult();
      } catch (e) {
        return;
      }
    } else {
      return this.getTradingSignal(signal[bound].id).update(
        Number(candle.close),
      );
    }
  }

  setTradeSignals({
    buySignals,
    sellSignals,
  }: {
    buySignals: Signal[][];
    sellSignals: Signal[][];
  }) {
    const _buysignals = buySignals.flatMap((buySignal) => buySignal);
    const _sellsignals = sellSignals.flatMap((sellSignal) => sellSignal);
    const signals = _buysignals.concat(_sellsignals);
    signals.forEach((signal) => {
      this.setTradingSignal(signal);
    });
  }

  setTradingSignal(signal: Signal) {
    const SignalsMap = this.SignalsMap;
    this.tradingSignals[signal.id] = new SignalsMap[signal.indicator.name](
      Number(signal.indicator.params.period),
    );
    if (typeof signal.upperBound.value === 'object') {
      this.tradingSignals[signal.upperBound.id] = new SignalsMap[
        signal.upperBound.value.name
      ](Number(signal.upperBound.value.params.period));
    }
    if (typeof signal.lowerBound.value === 'object') {
      this.tradingSignals[signal.lowerBound.id] = new SignalsMap[
        signal.lowerBound.value.name
      ](Number(signal.lowerBound.value.params.period));
    }
  }

  getTradingSignal(signalId: string) {
    return this.tradingSignals[signalId];
  }
}
