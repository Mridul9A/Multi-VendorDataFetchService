const { MongoClient } = require('mongodb');
const axios = require('axios');
const { redis, streamKey } = require('../queue/queue');
const { cleanData } = require('../utils/cleaner');

const mongoUrl = 'mongodb://mongo:27017';

(async () => {
  const mongo = await MongoClient.connect(mongoUrl);
  const db = mongo.db('jobsDB');

  while (true) {
    const jobs = await redis.xread('BLOCK', 0, 'STREAMS', streamKey, '$');
    for (const [, entries] of jobs) {
      for (const [, [_, jobStr]] of entries) {
        const job = JSON.parse(jobStr);
        await db.collection('jobs').updateOne(
          { request_id: job.request_id },
          { $set: { status: 'processing' } }
        );

        try {
          const vendorUrl = job.payload.vendor === 'async'
            ? 'http://vendors:9000/async'
            : 'http://vendors:9000/sync';

          const response = await axios.post(vendorUrl, { request_id: job.request_id, data: job.payload });

          if (job.payload.vendor === 'sync') {
            const cleaned = cleanData(response.data);
            await db.collection('jobs').updateOne(
              { request_id: job.request_id },
              { $set: { status: 'complete', result: cleaned } }
            );
          }
        } catch (err) {
          await db.collection('jobs').updateOne(
            { request_id: job.request_id },
            { $set: { status: 'failed', error: err.message } }
          );
        }
      }
    }
  }
})();