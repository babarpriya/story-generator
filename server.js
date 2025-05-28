// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Load .env file

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // ✅ Serve static files from public folder

// Routes
app.post('/api/generate-story', async (req, res) => {
  try {
    const { genre, setting, character, traits, theme, length } = req.body;

    const prompt = `
      Write a detailed ${length} ${genre} story.
      Setting: ${setting}
      Main character: ${character} who is ${traits.join(", ")}.
      Theme: ${theme}.

      The story should be engaging and complete from beginning to end. Do not offer choices or ask questions to the reader. Just tell the full story.
    `;

    // Make request to OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mistral-7b-instruct', // Example model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.8
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Story Generator'
      }
    });

    const story = response.data.choices[0].message.content;

    res.json({ story });

  } catch (error) {
    console.error('Error generating story:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

