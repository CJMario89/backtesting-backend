import { Candle } from 'src/candles/candles.type';

export type Indicator = {
  id: string;
  name: string;
  params: Record<string, number | string | undefined>;
};

export type Signal = {
  id: string;
  indicator?: Indicator;
  action: string;
  logicOperator: string;
  upperBound: {
    id?: string;
    name?: string;
    value?: number | Indicator | string;
  };
  lowerBound: {
    id?: string;
    name?: string;
    value?: number | Indicator | string;
  };
};
export type BackTestInputDto = {
  symbol: string;
  start: string;
  end: string;
  capital: number;
  takeProfit: number;
  stopLoss: number;
  interval: string;
  buySignals: Signal[][];
  sellSignals: Signal[][];
};

export type Trade = {
  buy: Candle;
  sell: Candle;
  profit: number;
  capital: number;
  percentProfit: number;
  duration: number;
  maxDrawdown: number;
  buySignals?: Signal[];
  sellSignals?: Signal[];
};

export type BackTestOutput = {
  candles: Candle[];
  buySellCandlesPairs: Trade[];
  initailCaptial: number;
  capital: number;
  totalProfit: number;
  totalDuration: number;
  totalMaxDrawdown: number;
  profitRate: number;
  annualizedReturn: number;
  startTime: string;
  endTime: string;
  timeFrame: string;
};
