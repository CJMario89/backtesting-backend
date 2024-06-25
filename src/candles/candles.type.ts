export type Interval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1mon';

export type Candle = {
  openTime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};

export type getCandleDto = {
  interval: Interval;
  symbol: string;
  page: string;
};