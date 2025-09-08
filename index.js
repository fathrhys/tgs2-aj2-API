import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer();

//Set your default Gemini model here:
const GEMINI_MODEL = "gemini-1.5-flash";

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

//1. Generate text
app.post('/generate-text', async (req, res) => {
try {
    const { prompt } = req.body;
    const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt
    });
    res.json({ result: response });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//2. Generate from image
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagePart = {
      inlineData: {
        data: image.buffer.toString('base64'),
        mimeType: image.mimetype,
      },
    };

    const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [prompt, imagePart]
    });
    res.json({ result: response });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//3. Generate from document
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const document = req.file;

    if (!document) {
      return res.status(400).json({ error: 'No document file uploaded.' });
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const documentPart = {
      inlineData: {
        data: document.buffer.toString('base64'),
        mimeType: document.mimetype,
      },
    };

    const response = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: [prompt, documentPart]
    });
    res.json({ result: response });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//4. Generate from audio
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const audio = req.file;

    if (!audio) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const audioPart = {
      inlineData: {
        data: audio.buffer.toString('base64'),
        mimeType: audio.mimetype,
      },
    };

    const response = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: [prompt, audioPart]
    });
    res.json({ result: response });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});
