const express = require('express');
const router = express.Router();
const { GoogleGenAI }  = require( "@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    console.info('prompt',  prompt)
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

    const responseText = response?.text;

    if (responseText) {
      res.json({ result: responseText });
    } else {
      res.status(500).json({ error: 'No response from Gemini API' });
    }
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate travel plan' });
  }
});

module.exports = router;