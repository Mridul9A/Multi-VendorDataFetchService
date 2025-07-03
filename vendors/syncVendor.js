const express = require('express');
const app = express();
app.use(express.json());

app.post('/sync', (req, res) => {
  const { data } = req.body;
  res.json({ result: `Processed ${data.user}` });
});

app.listen(9000, () => console.log('Sync vendor on 9000'));