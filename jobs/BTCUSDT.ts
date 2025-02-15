import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//data = [time, open, high, low, close, volume, close_time, base_asset_volume, number_of_trades, taker_buy_quote_asset_volume, taker_buy_base_asset_volume, ignore]

interface Bar {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  close_time: string;
  base_asset_volume: string;
  number_of_trades: string;
  taker_buy_quote_asset_volume: string;
  taker_buy_base_asset_volume: string;
  ignore: string;
}

async function insertPrice(data: string[][]) {
  try {
    await prisma.$transaction(
      data.map((entry: string[]) =>
        prisma.btcusdt_1m.upsert({
          where: {
            time: entry[0].toString(),
          },
          update: {
            open: entry[1],
            high: entry[2],
            low: entry[3],
            close: entry[4],
            volume: entry[5],
            close_time: entry[6].toString(),
            base_asset_volume: entry[7],
            number_of_trades: entry[8].toString(),
            taker_buy_quote_asset_volume: entry[9],
            taker_buy_base_asset_volume: entry[10],
            ignore: entry[11],
          },
          create: {
            time: entry[0].toString(),
            open: entry[1],
            high: entry[2],
            low: entry[3],
            close: entry[4],
            volume: entry[5],
            close_time: entry[6].toString(),
            base_asset_volume: entry[7],
            number_of_trades: entry[8].toString(),
            taker_buy_quote_asset_volume: entry[9],
            taker_buy_base_asset_volume: entry[10],
            ignore: entry[11],
          },
        }),
      ),
    );

    for (let i = 0; i < data.length; i++) {
      const deltaT = Number(data?.[i]?.[0]) - 1502942400000;
      await Promise.all([
        await insertMinuteTimeFrame(deltaT, 3),
        await insertMinuteTimeFrame(deltaT, 5),
        await insertMinuteTimeFrame(deltaT, 15),
        await insertMinuteTimeFrame(deltaT, 30),
        await insertMinuteTimeFrame(deltaT, 60),
        await insertHourTimeFrame(deltaT, 2),
        await insertHourTimeFrame(deltaT, 4),
        await insertHourTimeFrame(deltaT, 6),
        await insertHourTimeFrame(deltaT, 8),
        await insertHourTimeFrame(deltaT, 12),
        await insertHourTimeFrame(deltaT, 24),
        await insertDayTimeFrame(deltaT, 3),
        await insertDayTimeFrame(deltaT, 7),
        await insertDayTimeFrame(deltaT, 30),
      ]);
    }
    console.log('done');
  } catch (error) {
    console.error('Error inserting price data:', error);
    throw error;
  }
}

const minuteInMilliseconds = 60000;

//BTCUSDT init timestamp 1502942400000
CronJob.from({
  cronTime: '*/5 * * * * *',
  onTick: async function () {
    const startTime = (await findNextTime()) ?? 1502942400000;
    console.log(startTime);
    const url = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${
      Number(startTime)
      // Date.now() - minuteInMilliseconds
    }&endTime=${Date.now()}&limit=1000`;
    const response = await fetch(url);
    const data = await response.json();
    insertPrice(data);
  },
  start: true,
  timeZone: 'America/Los_Angeles',
});

async function findNextTime() {
  const lastestTime: { max: string }[] =
    await prisma.$queryRaw`SELECT MAX("time") as max FROM "btcusdt_1m"`;
  return lastestTime[0]?.max
    ? Number(lastestTime[0]?.max) + minuteInMilliseconds
    : null;
}

async function insertMinuteTimeFrame(deltaT: number, minutes: number) {
  if (deltaT % (minuteInMilliseconds * minutes) !== 0) {
    //first minute of the minutes
    return;
  }

  const startTime = deltaT + 1502942400000 - minuteInMilliseconds * minutes;
  const timestamps = Array.from({ length: minutes + 1 }, (_, i) =>
    (startTime + minuteInMilliseconds * i).toString(),
  );
  const data = await prisma.btcusdt_1m.findMany({
    orderBy: { time: 'asc' },
    where: { time: { in: timestamps } },
    select: {
      time: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
      close_time: true,
      base_asset_volume: true,
      number_of_trades: true,
      taker_buy_quote_asset_volume: true,
      taker_buy_base_asset_volume: true,
      ignore: true,
    },
  });
  if (data.length < minutes) return;
  const bar = compressDataToBar(data);

  switch (minutes) {
    case 3:
      await prisma.btcusdt_3m.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 5:
      await prisma.btcusdt_5m.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 15:
      await prisma.btcusdt_15m.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 30:
      await prisma.btcusdt_30m.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 60:
      await prisma.btcusdt_1h.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
  }
}

async function insertHourTimeFrame(deltaT: number, hours: number) {
  if (deltaT % (minuteInMilliseconds * 60 * hours) !== 0) {
    return;
  }
  const startTime = deltaT + 1502942400000 - minuteInMilliseconds * 60 * hours;
  const timestamps = Array.from({ length: hours + 1 }, (_, i) =>
    (startTime + minuteInMilliseconds * 60 * i).toString(),
  );
  const data = await prisma.btcusdt_1h.findMany({
    orderBy: { time: 'asc' },
    where: { time: { in: timestamps } },
    select: {
      time: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
      close_time: true,
      base_asset_volume: true,
      number_of_trades: true,
      taker_buy_quote_asset_volume: true,
      taker_buy_base_asset_volume: true,
      ignore: true,
    },
  });
  if (data.length < hours) return;

  const bar = compressDataToBar(data);

  switch (hours) {
    case 2:
      await prisma.btcusdt_2h.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 4:
      await prisma.btcusdt_4h.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 6:
      await prisma.btcusdt_6h.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 8:
      await prisma.btcusdt_8h.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 12:
      await prisma.btcusdt_12h.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 24:
      await prisma.btcusdt_1d.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
  }
}

async function insertDayTimeFrame(deltaT: number, days: number) {
  if (deltaT % (minuteInMilliseconds * 60 * 24 * days) !== 0) {
    return;
  }
  const startTime =
    deltaT + 1502942400000 - minuteInMilliseconds * 60 * 24 * days;
  const timestamps = Array.from({ length: days + 1 }, (_, i) =>
    (startTime + minuteInMilliseconds * 60 * 24 * i).toString(),
  );
  const data = await prisma.btcusdt_1d.findMany({
    orderBy: { time: 'asc' },
    where: { time: { in: timestamps } },
    select: {
      time: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
      close_time: true,
      base_asset_volume: true,
      number_of_trades: true,
      taker_buy_quote_asset_volume: true,
      taker_buy_base_asset_volume: true,
      ignore: true,
    },
  });
  if (data.length < days) return;

  const bar = compressDataToBar(data);

  switch (days) {
    case 3:
      await prisma.btcusdt_3d.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 7:
      await prisma.btcusdt_1w.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
    case 30:
      await prisma.btcusdt_1mon.upsert({
        where: {
          time: bar.time,
        },
        update: bar,
        create: bar,
      });
      break;
  }
}

function compressDataToBar(data: Bar[]): Bar {
  const time = data[0].time;
  const open = data[0].open;
  const high = Math.max(...data.map((bar) => Number(bar.high)));
  const low = Math.min(...data.map((bar) => Number(bar.low)));
  const close = data[data.length - 1].close;
  const volume = data
    .reduce((acc, bar) => acc + Number(bar.volume), 0)
    .toString();
  const close_time = data[data.length - 1].close_time;
  const base_asset_volume = data
    .reduce((acc, bar) => acc + Number(bar.base_asset_volume), 0)
    .toString();
  const number_of_trades = data
    .reduce((acc, bar) => acc + Number(bar.number_of_trades), 0)
    .toString();
  const taker_buy_quote_asset_volume = data
    .reduce((acc, bar) => acc + Number(bar.taker_buy_quote_asset_volume), 0)
    .toString();
  const taker_buy_base_asset_volume = data
    .reduce((acc, bar) => acc + Number(bar.taker_buy_base_asset_volume), 0)
    .toString();
  const ignore = data
    .reduce((acc, bar) => acc + Number(bar.ignore), 0)
    .toString();
  return {
    time,
    open,
    high: high.toString(),
    low: low.toString(),
    close,
    volume,
    close_time,
    base_asset_volume,
    number_of_trades,
    taker_buy_quote_asset_volume,
    taker_buy_base_asset_volume,
    ignore,
  };
}
