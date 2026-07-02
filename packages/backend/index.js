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
    const noteSection = req.body.note ? `The developer also said about this session: ${req.body.note}` : '';
    const prompt = `You are the developer writing your own devlog entry for the Stardance challenge, based on your recent git commits and their file-change stats.

                    Write in first person, as if you're the one who did the work. Match how a real developer talks about their own code, not how a press release describes a product. You were there. You remember doing this. Do not describe your own actions from the outside, like someone reading a report.

                    Rules:
                    - First sentence states exactly what changed. No throat-clearing, no "today I worked on," no scene-setting.
                    - 3 to 6 sentences total.
                    - Use the insertion and deletion counts to judge how much effort or difficulty a commit involved, but never state the actual numbers in the devlog. Don't write things like "six hundred forty-two insertions" or "300 lines changed." Just describe what it felt like or what it took, the way a person would from memory, not the way a diff tool would report it. If you need to write a number for some other reason, use digits, not words.
                    - Bad: "It looks like I had to rewrite large chunks of the script several times." Good: "I rewrote large chunks of the script a few times before it worked."
                    - Do not smooth every commit into one clean narrative. If the commits look messy or disconnected, let that show. Real work is not always tidy.
                    - No inflated language about significance, milestones, or "marking a moment." Just say what happened.
                    - No rule of three (avoid listing exactly three examples or three adjectives in a row, it reads as generated).
                    - No em dashes.
                    - Avoid words like "streamline," "showcase," "underscore," "robust," "seamless," "enhance," "leverage." Use plain verbs instead: made, fixed, changed, broke, added.
                    - Vary sentence length. Do not make every sentence the same shape or length.
                    - It's fine to sound slightly unfinished or informal if that fits, this is a working log, not marketing copy.

                    Commits with file stats:
                    ${req.body.commits.map((commit) => {return `${commit.message} (${commit.date}) (${commit.stats.join('\n')})`}).join('\n')}

                    ${noteSection}

                    Write the devlog entry now, as the developer, in your own voice.`;
    const client = new OpenRouter({
        apiKey: process.env.HACKCLUB_API_KEY,
        serverURL: 'https://ai.hackclub.com/proxy/v1',
    });
    try {
    const response = await client.chat.send({
        chatRequest: {
            model: 'qwen/qwen3-32b',
            messages: [
                {role: 'user', content: `${prompt}`}
            ],

        }
        

    });
    console.log(response.choices[0].message.content)
    console.log(JSON.stringify(response, null, 2));
    res.send(response.choices[0].message.content)
} catch (error) {
    try {
        if (error.statusCode === 429) {
            const response = await client.chat.send({
            chatRequest: {
                model: 'google/gemma-4-31b-it:free',
                messages: [
                    {role: 'user', content: `${prompt}`}
                ],

            }
            

        });
        console.log(response.choices[0].message.content);
        console.log(JSON.stringify(response, null, 2));
        res.send(response.choices[0].message.content);
        } else {
            res.status(500).send('Failed to generate devlog');
            console.log(error);
        }

    } catch (error) {
        res.status(500).send('Failed to generate devlog');
            console.log(error);
    }

};
    
    
});