const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/async', (req, res) => {
  const { request_id, data } = req.body;
  setTimeout(() => {
    axios.post(`http://api:8000/vendor-webhook/async`, {
      request_id,
      result: `Processed async for ${data.user}`,
    });
  }, 3000);
  res.status(202).send('Accepted');
});

app.listen(9000, () => console.log('Async vendor on 9000'));
