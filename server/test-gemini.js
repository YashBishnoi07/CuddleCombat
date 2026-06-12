import { GoogleGenerativeAI } from '@google/generative-ai';

const run = async () => {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyCtd4sYxSzMu8WNTVvH3pAkb8VH1jUktOQ');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Output {"hello":"world"}' }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });
    console.log('SUCCESS:', result.response.text());
  } catch (e) {
    console.error('ERROR:', e);
  }
};
run();
