const express = require('express');
const { OpenRouter } = require('@openrouter/sdk');
require('dotenv').config();
const app = express();
const PORT = 3000;
app.use(express.json())
app.get('/health', (req, res) => {
    res.send('ok');
});

app.listen(PORT, () => {
    console.log(`Backend running on http:/localhost:${PORT}`);
});

app.post('/generate', async (req, res) => {
    const prompt = `You are writing a Stardance devlog entry based on the developer's recent git commits.
                    Follow these rules:
                    - First sentence: state exactly what changed, concretely (not "made progress").
                    - 3-6 sentences total.
                    - If the commits suggest something was hard, fixed, or iterated on multiple times, mention the friction honestly — don't smooth it over.
                    - No hype language, no "excited to share," no filler.
                    - Do not invent details not present in the commit data.

                    Commits:
                    ${req.body.commits.map((commit) => {return `${commit.message} (${commit.date})`}).join('\n')}

                    Write the devlog entry now.`;
    const client = new OpenRouter({
        apiKey: process.env.HACKCLUB_API_KEY,
        serverURL: 'https://ai.hackclub.com/proxy/v1',
    });
    try {
    const response = await client.chat.send({
        chatRequest: {
            model: 'openrouter/free',
            messages: [
                {role: 'user', content: `${prompt}`}
            ],

        }
        

    });
    console.log(response.choices[0].message.content)
    res.send(response.choices[0].message.content)
} catch (error) {res.status(500).send('Failed to generate devlog');
    console.log(error);

};
    
    
});