const express = require('express');
const { MongoClient } = require('mongodb');
const { cleanData } = require('../utils/cleaner');
const app = express();
app.use(express.json());

const mongoUrl = 'mongodb://mongo:27017';
let db;
MongoClient.connect(mongoUrl).then(client => db = client.db('jobsDB'));

app.post('/vendor-webhook/:vendor', async (req, res) => {
  const { request_id, result } = req.body;
  const cleaned = cleanData(result);
  await db.collection('jobs').updateOne(
    { request_id },
    { $set: { status: 'complete', result: cleaned } }
  );
  res.send('Webhook Received');
});

app.listen(8001, () => console.log('Webhook handler on 8001'));