const Redis = require('ioredis');
const redis = new Redis({ host: 'redis' });

const streamKey = 'jobs_stream';

async function sendToQueue(job) {
  await redis.xadd(streamKey, '*', 'job', JSON.stringify(job));
}

module.exports = { redis, streamKey, sendToQueue };