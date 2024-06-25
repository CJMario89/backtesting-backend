import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('btcusdt_15m_pkey', ['id'], { unique: true })
@Index('btcusdt_15m_openTime_key', ['openTime'], { unique: true })
@Index('btcusdt_15m_openTime_idx', ['openTime'], {})
@Entity('btcusdt_15m', { schema: 'public' })
export class Btcusdt_15m {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'openTime', default: () => "'0'" })
  openTime: string;

  @Column('text', { name: 'open', default: () => "'0'" })
  open: string;

  @Column('text', { name: 'high', default: () => "'0'" })
  high: string;

  @Column('text', { name: 'low', default: () => "'0'" })
  low: string;

  @Column('text', { name: 'close', default: () => "'0'" })
  close: string;

  @Column('text', { name: 'volume', default: () => "'0'" })
  volume: string;

  @Column('text', { name: 'closeTime', default: () => "'0'" })
  closeTime: string;

  @Column('text', { name: 'baseAssetVolume', default: () => "'0'" })
  baseAssetVolume: string;

  @Column('text', { name: 'numberOfTrades', default: () => "'0'" })
  numberOfTrades: string;

  @Column('text', { name: 'takerBuyQuoteAssetVolume', default: () => "'0'" })
  takerBuyQuoteAssetVolume: string;

  @Column('text', { name: 'takerBuyBaseAssetVolume', default: () => "'0'" })
  takerBuyBaseAssetVolume: string;

  @Column('text', { name: 'ignore', default: () => "'0'" })
  ignore: string;
}
