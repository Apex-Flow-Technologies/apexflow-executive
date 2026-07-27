import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Set up multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are the AI engine for ApexFlow Executive, a financial and deal pipeline dashboard. 
The user is sending an audio recording of a command. 
Transcribe the audio and extract intents based on the dashboard schema. 
Return ONLY a JSON object (no markdown formatting, no code blocks).

Schema of the desired JSON output:
{
  "transcription": "The transcribed text of the audio",
  "intent": "schedule_meeting" | "update_stage" | "update_financials" | "unknown",
  "action": {
     // If intent is schedule_meeting
     "clientName": "...",
     "date": "...",
     "time": "..."
  },
  "action2": {
     // If intent is update_stage
     "clientName": "...",
     "newStage": "Talking" | "Demo" | "Confirmation" | "After Demo"
  },
  "action3": {
     // If intent is update_financials
     "expenseAmount": number,
     "retainerAmount": number,
     "lumpSumAmount": number
  }
}
`;

app.post('/api/process-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const audioBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'audio/webm';

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: audioBase64,
                mimeType: mimeType,
              }
            },
            {
              text: "Process this audio command according to system instructions and return JSON."
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || "{}";
    const parsedData = JSON.parse(responseText);

    res.json(parsedData);

  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Failed to process audio command' });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
