import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//https://docs.glassnode.com/basic-api/endpoints/mining#hash-rate
//https://api.glassnode.com/v1/metrics/mining/hash_rate_mean?a=BTC&i=24h&s=1502928000
//https://api.blockchain.info/charts/hash-rate?timespan=6year&rollingAverage=24hours&format=json

const dayInMilliseconds = 86400000;
const timespan = '7year';
// const timespan = '1months';

CronJob.from({
  cronTime: '*/10 * * * * *', //every day
  onTick: async function () {
    const startTime = (await findNextTime()) ?? 1502928000;
    console.log(startTime);
    const url = `https://api.blockchain.info/charts/hash-rate?timespan=${timespan}&rollingAverage=24hours&format=json`;
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    const hashRates = data.values.map((entry: { x: number; y: number }) => {
      return {
        time: (entry.x * 1000 + 14400000).toString(),
        hashrate: entry.y.toString(),
      };
    });
    console.log(hashRates);
    // const updates = hashRates.map(async (entry) => {
    //   return prisma.btcusdt_1d.updateMany({
    //     where: { time: entry.time },
    //     data: { hashrate: entry.hashrate },
    //   });
    // });
    try {
      await prisma.$transaction((tx) => {
        return hashRates.map((entry) => {
          return tx.btcusdt_1d.updateMany({
            where: { time: entry.time },
            data: { hashrate: entry.hashrate },
          });
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
  start: true,
  timeZone: 'America/Los_Angeles',
});

async function findNextTime() {
  const lastestTime: { max: string }[] =
    await prisma.$queryRaw`SELECT MAX("time") FROM "btc_hashrate_1d"`;
  return lastestTime[0]?.max
    ? Number(lastestTime[0]?.max) + dayInMilliseconds
    : null;
}
