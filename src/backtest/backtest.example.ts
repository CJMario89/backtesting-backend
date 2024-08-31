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
          name: 'EMA',
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
          name: 'EMA',
          params: {
            period: '2',
            max: Infinity,
            min: 0,
          },
          id: '1716028642989',
        },
      },
      logicOperator: 'and',
      indicator: {
        name: 'EMA',
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
      indicator: {
        name: 'RSI',
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
      indicator: {
        name: 'RSI',
        params: {
          period: '3',
          max: 100,
          min: 0,
        },
        id: '1716028664889',
      },
    },
  ],
] as Signal[][];

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
      indicator: {
        name: 'RSI',
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
          name: 'EMA',
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
          name: 'EMA',
          params: {
            period: '4',
            max: Infinity,
            min: 0,
          },
          id: '1716028648929',
        },
      },
      logicOperator: 'and',
      indicator: {
        name: 'EMA',
        params: {
          period: '3',
          max: Infinity,
          min: 0,
        },
        id: '1716028645927',
      },
    },
  ],
] as Signal[][];

export const testSignal1 = {
  id: '1',
  logicOperator: 'and',
  action: 'buy',
  lowerBound: {
    id: 'lowerbound1',
    value: {
      name: 'SMA',
      params: {
        period: '4',
      },
      id: '1716028648929',
    },
  },
  upperBound: {
    id: 'upperbound1',
    value: {
      name: 'SMA',
      params: {
        period: '2',
      },
      id: '1716028648929',
    },
  },
  indicator: {
    name: 'SMA',
    params: {
      period: '3',
    },
    id: '1716028645927',
  },
} as Signal;

export const testSignal2 = {
  id: '2',
  action: 'buy',
  logicOperator: 'and',
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
    name: 'RSI',
    params: {
      period: '3',
    },
    id: '1716028645927',
  },
} as Signal;

export const testSignal3 = {
  id: '3',
  action: 'buy',
  logicOperator: 'and',
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
    name: 'EMA',
    params: {
      period: '3',
    },
    id: '1716028645927',
  },
} as Signal;

export const testCandles = [3, 6, 1, 8, 5, 9].map((candle, index) => ({
  close: candle,
  volume: 1,
  time: (index + 1) * 1000,
  open: 1,
  high: 1,
  low: 1,
}));

export const testCandles2 = [4, 3, 3, 4, 5, 5, 6, 1, 2, 2].map(
  (candle, index) => ({
    close: candle,
    volume: 1,
    time: (index + 1) * 1000,
    open: 1,
    high: 1,
    low: 1,
  }),
); //24 candles
//buy cal by script
// EMA(4)
export const testCandles2_EMA4 = [
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
// EMA(3)
export const testCandles2_EMA3 = [
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
// EMA(2)
export const testCandles2_EMA2 = [
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
  close: candle,
  volume: 1,
  time: (index + 1) * 1000,
  open: 1,
  high: 1,
  low: 1,
}));

export const testCandles3_EMA2 = ['6', '3', '3', '4', '7', '7', '6', '6'];

export const testCandles3_EMA3 = ['6', '4', '4', '4', '6', '7', '6', '6'];
export const testCandles3_EMA4 = ['6', '4', '4', '4', '6', '6', '6', '6'];

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
