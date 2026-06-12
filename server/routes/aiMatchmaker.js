import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemInstruction = `You are a movie recommendation engine API. You take a user's natural language vibe or prompt and convert it strictly into JSON format that matches our TMDB filtering schema.
    Output ONLY raw JSON with these exact keys. No markdown blocks, no intro, no outro:
    {
      "services": "comma separated string of: netflix, prime video, disney+ hotstar, sonyliv, jiocinema, zee5, hulu, max, crunchyroll. Try to guess based on prompt. Leave empty if none.",
      "genres": "comma separated string of: action, comedy, horror, romance, sci-fi, drama. Try to map prompt to these. Leave empty if none.",
      "decade": "one of: 2020, 2010, 2000, 1990, 1980. Or 'all'.",
      "runtime": "one of: 90, 120, 150. Or 'all'."
    }
    
    User prompt: ${prompt}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const filters = JSON.parse(text);
    res.json(filters);
  } catch (error) {
    console.error('AI Matchmaker Error:', error);
    res.status(500).json({ message: 'Failed to generate recommendations from AI' });
  }
});

export default router;
