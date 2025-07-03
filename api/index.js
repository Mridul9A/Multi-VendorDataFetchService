const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const { sendToQueue } = require('../queue/queue');
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoUrl = 'mongodb://mongo:27017';
let db;

MongoClient.connect(mongoUrl).then((client) => {
  db = client.db('jobsDB');
});

app.post('/jobs', async (req, res) => {
  const requestId = uuidv4();
  const job = {
    request_id: requestId,
    status: 'pending',
    payload: req.body,
  };
  await db.collection('jobs').insertOne(job);
  await sendToQueue({ request_id: requestId, payload: req.body });
  res.json({ request_id: requestId });
});

app.get('/jobs/:id', async (req, res) => {
  const job = await db.collection('jobs').findOne({ request_id: req.params.id });
  if (!job) return res.status(404).send('Not Found');
  if (job.status === 'complete') res.json({ status: 'complete', result: job.result });
  else res.json({ status: 'processing' });
});

app.listen(8000, () => console.log('API running on 8000'));