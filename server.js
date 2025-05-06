const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Received connection from IP: ${ip}`);

    if (webhookUrl) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `New connection from IP: \`${ip}\``,
            }),
        })
        .then(response => {
            if (!response.ok) {
                console.error(`Failed to send webhook: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => console.error('Error sending webhook:', error));
    } else {
        console.warn('DISCORD_WEBHOOK_URL environment variable is not set.');
    }

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
