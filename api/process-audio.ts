import type { VercelRequest, VercelResponse } from '@vercel/node';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await runMiddleware(req, res, upload.single('audio'));

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on Vercel environment variables.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const audioBase64 = file.buffer.toString('base64');
    const mimeType = file.mimetype || 'audio/webm';

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

    return res.status(200).json(parsedData);

  } catch (error: any) {
    console.error('Error processing audio:', error);
    return res.status(500).json({ error: 'Failed to process audio command', details: error?.message || String(error) });
  }
}
