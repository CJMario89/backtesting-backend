-- CreateTable
CREATE TABLE "btcusdt_1m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_1m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_3m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_3m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_5m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_5m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_15m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_15m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_30m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_30m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_1h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_1h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_2h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_2h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_4h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_4h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_6h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_6h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_8h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_8h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_12h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_12h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_1d" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_1d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_3d" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_3d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_1w" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_1w_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "btcusdt_1mon" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "btcusdt_1mon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "btcusdt_1m_openTime_idx" ON "btcusdt_1m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_1m_openTime_key" ON "btcusdt_1m"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_3m_openTime_idx" ON "btcusdt_3m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_3m_openTime_key" ON "btcusdt_3m"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_5m_openTime_idx" ON "btcusdt_5m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_5m_openTime_key" ON "btcusdt_5m"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_15m_openTime_idx" ON "btcusdt_15m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_15m_openTime_key" ON "btcusdt_15m"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_30m_openTime_idx" ON "btcusdt_30m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_30m_openTime_key" ON "btcusdt_30m"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_1h_openTime_idx" ON "btcusdt_1h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_1h_openTime_key" ON "btcusdt_1h"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_2h_openTime_idx" ON "btcusdt_2h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_2h_openTime_key" ON "btcusdt_2h"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_4h_openTime_idx" ON "btcusdt_4h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_4h_openTime_key" ON "btcusdt_4h"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_6h_openTime_idx" ON "btcusdt_6h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_6h_openTime_key" ON "btcusdt_6h"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_8h_openTime_idx" ON "btcusdt_8h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_8h_openTime_key" ON "btcusdt_8h"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_12h_openTime_idx" ON "btcusdt_12h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_12h_openTime_key" ON "btcusdt_12h"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_1d_openTime_idx" ON "btcusdt_1d" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_1d_openTime_key" ON "btcusdt_1d"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_3d_openTime_idx" ON "btcusdt_3d" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_3d_openTime_key" ON "btcusdt_3d"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_1w_openTime_idx" ON "btcusdt_1w" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_1w_openTime_key" ON "btcusdt_1w"("openTime");

-- CreateIndex
CREATE INDEX "btcusdt_1mon_openTime_idx" ON "btcusdt_1mon" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "btcusdt_1mon_openTime_key" ON "btcusdt_1mon"("openTime");
