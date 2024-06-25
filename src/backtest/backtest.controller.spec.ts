import { EntityManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppDataSource } from 'src/data-source';
import { BacktestController } from './backtest.controller';
import { BacktestService } from './backtest.service';
import {
  testSignal1,
  testSignal2,
  testSignal3,
  testCandles,
  testCandles2_rsi3,
  testCandles2,
  testCandles2_ema2,
  testCandles2_ema3,
  testCandles2_ema4,
  testBuySignals,
  testSellSignals,
  testCandles3,
  testCandles3_rsi3,
  testCandles3_ema2,
  testCandles3_ema3,
  testCandles3_ema4,
} from './backtest.example';
import { Indicator } from './backtest.type';

// signals => shouldBuy
// signals => shouldSell
// getBoundValue

const testSignals1 = {
  id: '05bac957-eeb4-4ae2-81eb-c0ad2a7b3ce1',
  action: 'buy',
  lowerBound: {
    id: '0d952b98-5d03-49ad-b168-58ac5ba84978',
    name: '1716028648929',
    value: {
      name: 'ema',
      params: {
        period: '210',
        max: null,
        min: null,
      },
      displayName: 'ema 210 ',
      isShowInChart: true,
      color: '#bb1163',
      id: '1716028648929',
    },
  },
  upperBound: {
    id: '9a78c41a-cf44-4732-a8f1-7e9f0573116f',
    name: '1716028642989',
    value: {
      name: 'ema',
      params: {
        period: '21',
        max: null,
        min: null,
      },
      displayName: 'ema 21 ',
      isShowInChart: true,
      color: '#BB6611',
      id: '1716028642989',
    },
  },
  logicOperator: 'or',
  indicatorId: '1716028645927',
  indicator: {
    name: 'ema',
    params: {
      period: '70',
      max: null,
      min: null,
    },
    displayName: 'ema 70 ',
    isShowInChart: true,
    color: '#113cbb',
    id: '1716028645927',
  },
};

describe('BacktestController', () => {
  let controller: BacktestController;
  let service: BacktestService;

  beforeEach(async () => {
    service = new BacktestService(new EntityManager(AppDataSource));
    controller = new BacktestController(service);
    await import('trading-signals'); // after service import trading-signals
  });

  //control group
  //signal (test in indicator)
  //bound value type (lower bound)
  //indicator

  describe('test indicator', () => {
    it('should return correct test1 result', async () => {
      service.setTradingSignal(testSignal1);
      const period = Number(testSignal1.indicator.params.period);
      const sma = new service.SignalsMap['sma'](period);
      testCandles.forEach(async (candle) => {
        const result = service
          .getTradingSignal(testSignal1.id)
          .update(Number(candle.close));
        expect(result).toBe(sma.update(Number(candle.close)));
      });
    });

    it('should return correct test2 result', async () => {
      service.setTradingSignal(testSignal2);
      const period = Number(testSignal2.indicator.params.period);
      const rsi = new service.SignalsMap['rsi'](period);
      testCandles.forEach(async (candle) => {
        const result = service
          .getTradingSignal(testSignal2.id)
          .update(Number(candle.close));
        expect(result).toBe(rsi.update(Number(candle.close)));
      });
    });

    it('should return correct test3 result', async () => {
      service.setTradingSignal(testSignal3);
      const period = Number(testSignal3.indicator.params.period);
      const ema = new service.SignalsMap['ema'](period);
      testCandles.forEach(async (candle) => {
        const result = service
          .getTradingSignal(testSignal3.id)
          .update(Number(candle.close));
        expect(result).toBe(ema.update(Number(candle.close)));
      });
    });
  });

  describe('Get bound value (lower bound)', () => {
    //lower bound is sma indicator
    it('should return correct test1 result', async () => {
      //set and get lowerBound signal
      service.setTradingSignal(testSignal1);
      const period = Number(
        (testSignal1.lowerBound.value as Indicator).params.period,
      );
      const tradeSignal = new service.SignalsMap['sma'](period);

      //test for each candle
      testCandles.forEach(async (candle) => {
        const value = service.getBoundValue('lowerBound', testSignal1, candle);
        expect(value).toBe(tradeSignal.update(Number(candle.close)));
      });
    });

    //lower bound is value 50
    it('should return correct test2 result', async () => {
      //test for each candle
      testCandles.forEach(async (candle) => {
        const value = service.getBoundValue('lowerBound', testSignal2, candle);
        expect(value).toBe(50);
      });
    });

    //lower bound is previos indicator
    it('should return correct test3 result', async () => {
      //set and get upperBound signal
      service.setTradingSignal(testSignal3);
      const period = Number((testSignal3.indicator as Indicator).params.period);
      const tradeSignal = new service.SignalsMap['ema'](period);
      //test for each candle
      testCandles.forEach((candle) => {
        const value = service.getBoundValue('lowerBound', testSignal3, candle);
        service.getTradingSignal(testSignal3.id).update(Number(candle.close));
        let result;
        try {
          result = tradeSignal.getResult();
        } catch (e) {}
        expect(value).toBe(result);
        tradeSignal.update(Number(candle.close));
      });
    });
  });

  describe('Get bound value (upper bound)', () => {
    //lower bound is sma indicator
    it('should return correct test1 result', async () => {
      //set and get upperBound signal
      service.setTradingSignal(testSignal1);
      const period = Number(
        (testSignal1.upperBound.value as Indicator).params.period,
      );
      const tradeSignal = new service.SignalsMap['sma'](period);

      //test for each candle
      testCandles.forEach(async (candle) => {
        const value = service.getBoundValue('upperBound', testSignal1, candle);
        expect(value).toBe(tradeSignal.update(Number(candle.close)));
      });
    });

    //upper bound is max 100
    it('should return correct test2 result', async () => {
      //test for each candle
      testCandles.forEach(async (candle) => {
        const value = service.getBoundValue('upperBound', testSignal2, candle);
        expect(value).toBe(100);
      });
    });

    //upper bound is max Infinity
    it('should return correct test3 result', async () => {
      //test for each candle
      testCandles.forEach(async (candle) => {
        const value = service.getBoundValue('upperBound', testSignal3, candle);

        expect(value).toBe(Infinity);
      });
    });
  });

  describe('Validate signal correctness', () => {
    it('RSI signal', async () => {
      const rsi = new service.SignalsMap['rsi'](3);
      const testCandleRSIs = [undefined, undefined, undefined, 67, 51, 67]; //from omnicalculator.com
      testCandles.forEach(async (candle, index) => {
        const value = rsi.update(Number(candle.close));
        const result = value ? Number(Number(value).toFixed(0)) : value;
        expect(result).toBe(testCandleRSIs[index]);
      });
    });

    it('SMA signal', async () => {
      const sma = new service.SignalsMap['sma'](3);
      const testCandleRSIs = [undefined, undefined, 3, 5, 5, 7]; //from omnicalculator.com
      testCandles.forEach(async (candle, index) => {
        const value = sma.update(Number(candle.close));
        const result = value ? Number(Number(value).toFixed(0)) : value;
        expect(result).toBe(testCandleRSIs[index]);
      });
    });

    it('EMA signal', async () => {
      const ema = new service.SignalsMap['ema'](3);
      const testCandleRSIs = [3, 5, 3, 5, 5, 7]; //from goodcalculators.com
      testCandles.forEach(async (candle, index) => {
        const value = ema.update(Number(candle.close));
        const result = value ? Number(Number(value).toFixed(0)) : value;
        expect(result).toBe(testCandleRSIs[index]);
      });
    });
  });

  describe('Test candles 2', () => {
    it('should return correct result', async () => {
      const rsi = new service.SignalsMap['rsi'](3);
      const ema2 = new service.SignalsMap['ema'](2);
      const ema3 = new service.SignalsMap['ema'](3);
      const ema4 = new service.SignalsMap['ema'](4);
      testCandles2.forEach(async (candle, index) => {
        const value = rsi.update(Number(candle.close));
        const result = value ? Number(value).toFixed(0) : value;
        expect(result).toBe(testCandles2_rsi3[index]);
      });
      testCandles2.forEach(async (candle, index) => {
        const value = ema2.update(Number(candle.close));
        const result = value ? Number(value).toFixed(0) : value;
        expect(result).toBe(testCandles2_ema2[index]);
      });
      testCandles2.forEach(async (candle, index) => {
        const value = ema3.update(Number(candle.close));
        const result = value ? Number(value).toFixed(0) : value;
        expect(result).toBe(testCandles2_ema3[index]);
      });
      testCandles2.forEach(async (candle, index) => {
        const value = ema4.update(Number(candle.close));
        const result = value ? Number(value).toFixed(0) : value;
        expect(result).toBe(testCandles2_ema4[index]);
      });
    });
  });

  describe('Test candles 3', () => {
    it('should return correct result', async () => {
      const rsi = new service.SignalsMap['rsi'](3);
      const ema2 = new service.SignalsMap['ema'](2);
      const ema3 = new service.SignalsMap['ema'](3);
      const ema4 = new service.SignalsMap['ema'](4);
      testCandles3.forEach(async (candle, index) => {
        const value = rsi.update(Number(candle.close));
        const result = value ? Number(value).toFixed(0) : value;
        expect(result).toBe(testCandles3_rsi3[index]);
      });
      testCandles3.forEach(async (candle, index) => {
        const value = ema2.update(Number(candle.close));
        const result = value ? Number(value).toFixed(0) : value;
        expect(result).toBe(testCandles3_ema2[index]);
      });
      testCandles3.forEach(async (candle, index) => {
        const value = ema3.update(Number(candle.close));
        const result = value ? Number(value).toFixed(0) : value;
        expect(result).toBe(testCandles3_ema3[index]);
      });
      testCandles3.forEach(async (candle, index) => {
        const value = ema4.update(Number(candle.close));
        const result = value ? Number(value).toFixed(0) : value;
        expect(result).toBe(testCandles3_ema4[index]);
      });
    });
  });

  describe('Test get back test result with testCandles2', () => {
    it('should return correct result', async () => {
      service.setTradeSignals({
        buySignals: testBuySignals,
        sellSignals: testSellSignals,
      });
      //need to get more bar before the first candle
      const result = service.getBackTestResult({
        candles: testCandles2,
        buySignals: testBuySignals,
        sellSignals: testSellSignals,
        capital: 1000,
      });

      const firstTradeProfitPercent =
        (Number(testCandles2[6].close) - Number(testCandles2[4].close)) /
        Number(testCandles2[4].close);
      const secondTradeProfitPercent =
        (Number(testCandles2[8].close) - Number(testCandles2[7].close)) /
        Number(testCandles2[7].close);
      const expected = {
        trades: [
          {
            buy: testCandles2[4],
            sell: testCandles2[6],
            profit: 1000 * firstTradeProfitPercent,
            capital: 1000 * (1 + firstTradeProfitPercent),
            percentProfit: firstTradeProfitPercent,
            duration:
              Number(testCandles2[6].openTime) -
              Number(testCandles2[4].openTime),
            maxDrawdown: 0,
            buySignals: [testBuySignals[0]],
            sellSignals: [testSellSignals[0]],
          },
          {
            buy: testCandles2[7],
            sell: testCandles2[8],
            profit:
              1000 * (1 + firstTradeProfitPercent) * secondTradeProfitPercent,
            capital:
              1000 *
              (1 + firstTradeProfitPercent) *
              (1 + secondTradeProfitPercent),
            percentProfit: secondTradeProfitPercent,
            duration:
              Number(testCandles2[8].openTime) -
              Number(testCandles2[7].openTime),
            maxDrawdown: 0,
            buySignals: [testBuySignals[1]],
            sellSignals: [testSellSignals[1]],
          },
        ],
        totalProfit:
          1000 * (1 + firstTradeProfitPercent) * secondTradeProfitPercent +
          1000 * firstTradeProfitPercent,
        maxDrawdown: 0,
      };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Test get back test result with testCandles3', () => {
    it('should return correct result', async () => {
      service.setTradeSignals({
        buySignals: testBuySignals,
        sellSignals: testSellSignals,
      });
      //need to get more bar before the first candle
      const result = service.getBackTestResult({
        candles: testCandles3,
        buySignals: testBuySignals,
        sellSignals: testSellSignals,
        capital: 1000,
      });

      const firstTradeProfitPercent =
        (Number(testCandles3[7].close) - Number(testCandles3[4].close)) /
        Number(testCandles3[4].close);
      console.log(testCandles3[4].close);
      console.log(testCandles3[7].close);
      console.log(firstTradeProfitPercent);
      const expected = {
        trades: [
          {
            buy: testCandles3[4],
            sell: testCandles3[7],
            profit: 1000 * firstTradeProfitPercent,
            capital: 1000 * (1 + firstTradeProfitPercent),
            percentProfit: firstTradeProfitPercent,
            duration:
              Number(testCandles3[7].openTime) -
              Number(testCandles3[4].openTime),
            maxDrawdown: -25,
            buySignals: [testBuySignals[0]],
            sellSignals: [],
          },
        ],
        totalProfit: 1000 * firstTradeProfitPercent,
        maxDrawdown: -25,
      };
      console.log(result);
      expect(result).toStrictEqual(expected);
    });
  });
});
