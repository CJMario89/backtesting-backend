import { Injectable } from '@nestjs/common';
// import {
//   BackTestInputDto,
//   BackTestOutput,
//   Indicator,
//   Signal,
//   Trade,
// } from './backtest.type';
import {
  BackTestInputDto,
  BackTestOutput,
  Indicator,
  Signal,
  Trade,
} from './backtest.type';
import { Candle } from 'src/candles/candles.type';
import { PrismaService } from 'src/prisma/prisma-service';

type FasterMACDResult = {
  histogram: number;
  signal: number;
  macd: number;
};

@Injectable()
export class BacktestService {
  private tradingSignals = {};
  public SignalsMap = {};
  constructor(private prisma: PrismaService) {
    (async () => {
      const TradingSignals = await import('trading-signals');
      const SignalsMap = {
        RSI: TradingSignals.FasterRSI,
        EMA: TradingSignals.FasterEMA,
        SMA: TradingSignals.FasterSMA,
        MACD: TradingSignals.FasterMACD,
        BBANDS: TradingSignals.FasterBollingerBands,
        BBANDSW: TradingSignals.FasterBollingerBandsWidth,
        CG: TradingSignals.FasterCG,
        MAD: TradingSignals.FasterMAD,
        MOM: TradingSignals.FasterMOM,
        ROC: TradingSignals.FasterROC,
        STOCHRSI: TradingSignals.FasterStochasticRSI,
        WMA: TradingSignals.FasterWMA,
        WSMA: TradingSignals.FasterWSMA,
        AC: TradingSignals.FasterAC,
        AO: TradingSignals.FasterAO,
        ATR: TradingSignals.FasterATR,
        CCI: TradingSignals.FasterCCI,
        DX: TradingSignals.FasterDX,
        ADX: TradingSignals.FasterADX,
        STOCH: TradingSignals.FasterStochasticOscillator,
        TR: TradingSignals.FasterTR,
        OBV: TradingSignals.FasterOBV,
      };
      type Signals =
        | typeof TradingSignals.FasterRSI
        | typeof TradingSignals.FasterEMA
        | typeof TradingSignals.FasterSMA
        | typeof TradingSignals.FasterMACD
        | typeof TradingSignals.FasterBollingerBands
        | typeof TradingSignals.FasterBollingerBandsWidth
        | typeof TradingSignals.FasterCG
        | typeof TradingSignals.FasterMAD
        | typeof TradingSignals.FasterMOM
        | typeof TradingSignals.FasterROC
        | typeof TradingSignals.FasterStochasticRSI
        | typeof TradingSignals.FasterWMA
        | typeof TradingSignals.FasterWSMA
        | typeof TradingSignals.FasterAC
        | typeof TradingSignals.FasterAO
        | typeof TradingSignals.FasterATR
        | typeof TradingSignals.FasterCCI
        | typeof TradingSignals.FasterDX
        | typeof TradingSignals.FasterADX
        | typeof TradingSignals.FasterStochasticOscillator
        | typeof TradingSignals.FasterTR
        | typeof TradingSignals.FasterOBV;
      type SingalNames = keyof typeof SignalsMap;
      this.SignalsMap = SignalsMap as Record<SingalNames, Signals>;
    })();
  }

  async postBackTesting({
    symbol,
    interval,
    start,
    end,
    capital,
    takeProfit,
    stopLoss,
    buySignals,
    sellSignals,
  }: BackTestInputDto): Promise<BackTestOutput> {
    const candles: Candle[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        "time",
        "open",
        "high",
        "low",
        "close",
        "volume"
      FROM "${symbol}_${interval}"
      WHERE "time" >= '${start}' AND "time" <= '${end}'
      ORDER BY "time" ASC`);
    // console.debug(start, end, candles.length, interval);
    // console.debug(buySignals);
    // console.debug(buySignals.map((signals) => signals.map((signal) => signal)));

    // console.debug(
    //   buySignals.map((signals) => signals.map((signal) => signal.lowerBound)),
    // );
    // console.debug(candles);
    this.setTradeSignals({
      buySignals,
      sellSignals,
    });

    // console.debug(this.SignalsMap);
    const { trades, totalProfit, maxDrawdown } = this.getBackTestResult({
      candles,
      buySignals,
      sellSignals,
      capital,
      takeProfit,
      stopLoss,
    });

    const totalDuration = Number(end) - Number(start);
    const profitRate = (totalProfit / capital) * 100;
    const totalYears = totalDuration / (1000 * 60 * 60 * 24 * 365);
    const annualizedReturn = (totalProfit / capital) * (1 / totalYears) * 100;
    return {
      candles: candles.map((candle) => ({
        time: Number(candle.time) / 1000,
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close),
        volume: Number(candle.volume),
      })),
      startTime: start,
      endTime: end,
      initialCaptial: capital,
      capital: capital + totalProfit,
      buySellCandlesPairs: trades,
      totalProfit,
      totalDuration,
      totalMaxDrawdown: maxDrawdown,
      profitRate,
      annualizedReturn,
      timeFrame: interval,
    };
  }

  getBackTestResult({
    candles,
    buySignals,
    sellSignals,
    capital,
    takeProfit,
    stopLoss,
  }: {
    candles: Candle[];
    buySignals: Signal[][];
    sellSignals: Signal[][];
    capital: number;
    takeProfit?: number;
    stopLoss?: number;
  }): {
    trades: Trade[];
    totalProfit: number;
    maxDrawdown: number;
  } {
    console.debug(buySignals);
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
      const lastCandle = candles[index - 1 < 0 ? 0 : index - 1];
      const _buySignals = [];
      const _sellSignals = [];
      //input signal.upperBound, signal.lowerBound, signal-logic(and or), currentValue, then return shouldBuy
      // signals => shouldBuy
      buySignals.forEach((signals) => {
        let shouldBuySignal = true;
        signals.forEach((signal) => {
          //should before update currentValue
          const { upperBound, lowerBound, currentValue } = this.getAllValues({
            signal,
            candle,
            lastCandle,
          });
          // console.debug(currentValue);
          // console.debug(signal);
          if (
            typeof currentValue === 'undefined' ||
            typeof upperBound === 'undefined' ||
            typeof lowerBound === 'undefined'
          ) {
            shouldBuySignal = false; //can't buy
          }
          console.log(lowerBound, currentValue, upperBound);

          if (currentValue > upperBound || currentValue < lowerBound) {
            shouldBuySignal = false; //can't buy
          }
          // console.debug(
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
          const { upperBound, lowerBound, currentValue } = this.getAllValues({
            signal,
            candle,
            lastCandle,
          });
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
          // console.debug(
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
        // console.debug(trade.capital, currentProfit, maxDrawdown);
        if (drawdown < maxDrawdown) {
          maxDrawdown = drawdown;
          trade.maxDrawdown = maxDrawdown;
        }
        const percentProfit = drawdown;
        if (percentProfit < stopLoss) {
          shouldSell = true;
          _sellSignals.push([
            {
              id: 'stopLoss',
              indicator: {
                displayName: 'Stop Loss',
              },
              action: 'sell',
              logicOperator: 'and',
              upperBound: {
                id: 'stopLoss',
                name: 'number',
                value: stopLoss + '%',
              },
              lowerBound: {},
            },
          ]);
        }

        if (percentProfit > takeProfit) {
          shouldSell = true;
          _sellSignals.push([
            {
              id: 'takeProfit',
              indicator: {
                displayName: 'Take Profit',
              },
              action: 'sell',
              logicOperator: 'and',
              upperBound: {},
              lowerBound: {
                id: 'takeProfit',
                name: 'number',
                value: takeProfit + '%',
              },
            },
          ]);
        }
      }
      // console.debug(index);
      // console.debug(hasPosition);
      // console.debug(shouldBuy);
      // console.debug(candle.close);
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
        trade.duration = Number(trade.sell.time) - Number(trade.buy.time);
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
        trade.duration = Number(trade.sell.time) - Number(trade.buy.time);
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
    const indicator = signal.indicator;
    this.setCurrentTradingSignal({ signal, indicator });
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

  setCurrentTradingSignal({
    signal,
    indicator,
  }: {
    signal: Signal;
    indicator: Indicator;
  }) {
    const name = signal.indicator.name;
    if (name === 'price') {
      this.tradingSignals[signal.id] = 'price';
      return;
    } else if (name === 'volume') {
      this.tradingSignals[signal.id] = 'volume';
      return;
    } else if (name === 'MACD') {
      this.tradingSignals[signal.id] = new this.SignalsMap[name](
        new this.SignalsMap['EMA'](Number(indicator.params.short)),
        new this.SignalsMap['EMA'](Number(indicator.params.long)),
        new this.SignalsMap['EMA'](Number(indicator.params.signal)),
      );
      return;
    } else if (name === 'BBANDS') {
      this.tradingSignals[signal.id] = new this.SignalsMap[name](
        Number(indicator.params.period),
        Number(indicator.params.deviation),
      );
      return;
    } else if (name === 'AC') {
      this.tradingSignals[signal.id] = new this.SignalsMap[name](
        Number(indicator.params.short),
        Number(indicator.params.long),
        Number(indicator.params.signal),
      );
      return;
    } else if (name === 'AO') {
      this.tradingSignals[signal.id] = new this.SignalsMap[name](
        Number(indicator.params.short),
        Number(indicator.params.long),
      );
      return;
    } else if (name === 'BBANDSW') {
      this.tradingSignals[signal.id] = new this.SignalsMap[name](
        this.SignalsMap['BBANDSW'](
          Number(indicator.params.period),
          Number(indicator.params.deviation),
        ),
      );
      return;
    } else if (name === 'CG') {
      this.tradingSignals[signal.id] = new this.SignalsMap[name](
        Number(indicator.params.period),
        Number(indicator.params.signal),
      );
      return;
    } else if (name === 'OBV' || name === 'TR') {
      this.tradingSignals[signal.id] = new this.SignalsMap[name]();
      return;
    } else if (name === 'Stochastic') {
      this.tradingSignals[signal.id] = new this.SignalsMap[name](
        Number(indicator.params.period),
        Number(indicator.params.kPeriod),
        Number(indicator.params.dPeriod),
      );
      return;
    } else {
      this.tradingSignals[signal.id] = new this.SignalsMap[name](
        Number(indicator.params.period),
      );
      return;
    }
  }

  getTradingSignal(signalId: string) {
    return this.tradingSignals[signalId];
  }

  getAllValues({
    signal,
    candle,
    lastCandle,
  }: {
    signal: Signal;
    candle: Candle;
    lastCandle: Candle;
  }) {
    const upperBound = this.getBoundValue(
      'upperBound',
      signal,
      candle,
      lastCandle,
    );
    const lowerBound = this.getBoundValue(
      'lowerBound',
      signal,
      candle,
      lastCandle,
    );

    return {
      upperBound,
      lowerBound,
      currentValue: this.getIndicatorValue({
        signal,
        candle,
        signalId: signal.id,
      }),
    };
  }
  getIndicatorValue({
    candle,
    signal,
    signalId,
  }: {
    candle: Candle;
    signal: Signal;
    signalId: string;
  }) {
    let value;
    if (signalId === 'price') {
      return candle.close;
    }
    if (signalId === 'volume') {
      return candle.volume;
    }
    if (signal.indicator.params.input === 'candleVolume') {
      value = this.getTradingSignal(signalId).update({
        open: Number(candle.open),
        close: Number(candle.close),
        high: Number(candle.high),
        low: Number(candle.low),
        time: Number(candle.time),
        volume: Number(candle.volume),
      });
    } else if (signal.indicator.params.input === 'candle') {
      value = this.getTradingSignal(signalId).update({
        open: Number(candle.open),
        close: Number(candle.close),
        high: Number(candle.high),
        low: Number(candle.low),
        time: Number(candle.time),
        volume: Number(candle.volume),
      });
    } else {
      value = this.getTradingSignal(signalId).update(Number(candle.close));
    }
    // MACD or BBANDS or Stochastic
    if (signal.indicator.params.resultOption && typeof value !== 'undefined') {
      if (signal.indicator.name === 'ADX' || signal.indicator.name === 'DX') {
        if (signal.indicator.params.resultOption === 'mdi') {
          return this.getTradingSignal(signalId).mdi;
        }
        if (signal.indicator.params.resultOption === 'pdi') {
          return this.getTradingSignal(signalId).pdi;
        }
      }
      return (value as FasterMACDResult)?.[
        signal.indicator.params.resultOption
      ];
    } else {
      return value;
    }
  }

  // value: 0, 'previous', Indicator
  getBoundValue(
    bound: 'upperBound' | 'lowerBound',
    signal: Signal,
    candle: Candle,
    lastCandle: Candle,
  ) {
    const boundValue: number | string | Indicator = signal[bound].value;

    if (typeof boundValue === 'number') {
      // max or number
      return boundValue;
    } else if (boundValue === 'previous') {
      try {
        if (signal.id === 'price') {
          return lastCandle.close;
        } else if (signal.id === 'volume') {
          return lastCandle.volume;
        } else {
          return this.getTradingSignal(signal.id).getResult();
        }
      } catch (e) {
        return;
      }
    } else if (boundValue === 'price') {
      return Number(candle.close);
    } else if (boundValue === 'volume') {
      return Number(candle.volume);
    } else if (typeof boundValue === 'object') {
      let result = this.getIndicatorValue({
        candle,
        signal,
        signalId: signal[bound].id,
      });
      const times = boundValue?.params?.times;
      if (times) {
        result = result * Number(boundValue.params.times);
      }
      return result;
    } else {
      throw new Error('Invalid bound value');
    }
  }
}
