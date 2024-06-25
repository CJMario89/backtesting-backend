import { Signal } from './backtest.type';

export const testBuySignals = [
  [
    {
      id: 'b1',
      action: 'buy',
      lowerBound: {
        id: 'b1l',
        name: '1716028648929',
        value: {
          name: 'ema',
          params: {
            period: '4',
            max: Infinity,
            min: 0,
          },
          id: '1716028648929',
        },
      },
      upperBound: {
        id: 'b1u',
        name: '1716028642989',
        value: {
          name: 'ema',
          params: {
            period: '2',
            max: Infinity,
            min: 0,
          },
          id: '1716028642989',
        },
      },
      logicOperator: 'and',
      indicatorId: '1716028645927',
      indicator: {
        name: 'ema',
        params: {
          period: '3',
          max: Infinity,
          min: 0,
        },
        id: '1716028645927',
      },
    },
    {
      id: 'b2',
      action: 'buy',
      lowerBound: {
        id: 'b2l',
        name: 'number',
        value: 60,
      },
      upperBound: {
        id: 'b2u',
        name: 'max',
        value: 100,
      },
      logicOperator: 'or',
      indicatorId: '1716028664889',
      indicator: {
        name: 'rsi',
        params: {
          period: '3',
          max: 100,
          min: 0,
        },
        id: '1716028664889',
      },
    },
  ],
  [
    {
      id: 'b3',
      action: 'buy',
      lowerBound: {
        id: 'b3l',
        name: 'min',
        value: 0,
      },
      upperBound: {
        id: 'b3u',
        name: 'number',
        value: 30,
      },
      logicOperator: 'and',
      indicatorId: '1716028664889',
      indicator: {
        name: 'rsi',
        params: {
          period: '3',
          max: 100,
          min: 0,
        },
        id: '1716028664889',
      },
    },
  ],
];

export const testSellSignals = [
  [
    {
      id: 's1',
      action: 'sell',
      lowerBound: {
        id: 's1l',
        name: 'number',
        value: 80,
      },
      upperBound: {
        id: 's1u',
        name: 'max',
        value: 100,
      },
      logicOperator: 'or',
      indicatorId: '1716028664889',
      indicator: {
        name: 'rsi',
        params: {
          period: '3',
          max: 100,
          min: 0,
        },
        id: '1716028664889',
      },
    },
  ],
  [
    {
      id: 's2',
      action: 'sell',
      lowerBound: {
        id: 's2l',
        name: '1716028642989',
        value: {
          name: 'ema',
          params: {
            period: '2',
            max: Infinity,
            min: 0,
          },
          id: '1716028642989',
        },
      },
      upperBound: {
        id: 's2u',
        name: '1716028648929',
        value: {
          name: 'ema',
          params: {
            period: '4',
            max: Infinity,
            min: 0,
          },
          id: '1716028648929',
        },
      },
      logicOperator: 'and',
      indicatorId: '1716028645927',
      indicator: {
        name: 'ema',
        params: {
          period: '3',
          max: Infinity,
          min: 0,
        },
        id: '1716028645927',
      },
    },
  ],
];

export const testSignal1 = {
  id: '1',
  lowerBound: {
    id: 'lowerbound1',
    value: {
      id: '1716028648929',
      name: 'sma',
      params: {
        period: '4',
      },
    },
  },
  upperBound: {
    id: 'upperbound1',
    value: {
      id: '1716028648929',
      name: 'sma',
      params: {
        period: '2',
      },
    },
  },
  indicator: {
    name: 'sma',
    params: {
      period: '3',
    },
    id: '1716028645927',
  },
} as Signal;

export const testSignal2 = {
  id: '2',
  lowerBound: {
    id: 'lowerbound2',
    name: 'value',
    value: 50,
  },
  upperBound: {
    id: 'upperbound2',
    name: 'max',
    value: 100,
  },
  indicator: {
    name: 'rsi',
    params: {
      period: '3',
    },
    id: '1716028645927',
  },
} as Signal;

export const testSignal3 = {
  id: '3',
  lowerBound: {
    id: 'lowerbound3',
    value: 'previous',
  },
  upperBound: {
    id: 'upperbound3',
    name: 'max',
    value: Infinity, // to be fixed
  },
  indicator: {
    name: 'ema',
    params: {
      period: '3',
    },
    id: '1716028645927',
  },
} as Signal;

export const testCandles = [3, 6, 1, 8, 5, 9].map((candle, index) => ({
  close: candle.toString(),
  volume: '1',
  openTime: ((index + 1) * 1000).toString(),
  open: '1',
  high: '1',
  low: '1',
}));

export const testCandles2 = [4, 3, 3, 4, 5, 5, 6, 1, 2, 2].map(
  (candle, index) => ({
    close: candle.toString(),
    volume: '1',
    openTime: ((index + 1) * 1000).toString(),
    open: '1',
    high: '1',
    low: '1',
  }),
); //24 candles
//buy cal by script
// ema(4)
export const testCandles2_ema4 = [
  '4',
  '4',
  '3',
  '4',
  '4',
  '5',
  '5',
  '3',
  '3',
  '3',
];
// ema(3)
export const testCandles2_ema3 = [
  '4',
  '4',
  '3',
  '4',
  '4',
  '5',
  '5',
  '3',
  '3',
  '2',
];
// ema(2)
export const testCandles2_ema2 = [
  '4',
  '3',
  '3',
  '4',
  '5',
  '5',
  '6',
  '3',
  '2',
  '2',
];

export const testCandles2_rsi3 = [
  undefined,
  undefined,
  undefined,
  '50',
  '71',
  '71',
  '85',
  '18',
  '34',
  '34',
];

export const testCandles3 = [6, 2, 3, 5, 8, 7, 6, 6].map((candle, index) => ({
  close: candle.toString(),
  volume: '1',
  openTime: ((index + 1) * 1000).toString(),
  open: '1',
  high: '1',
  low: '1',
}));

export const testCandles3_ema2 = ['6', '3', '3', '4', '7', '7', '6', '6'];

export const testCandles3_ema3 = ['6', '4', '4', '4', '6', '7', '6', '6'];
export const testCandles3_ema4 = ['6', '4', '4', '4', '6', '6', '6', '6'];

export const testCandles3_rsi3 = [
  undefined,
  undefined,
  undefined,
  '43',
  '65',
  '55',
  '44',
  '44',
];
