import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as googleTTS from 'google-tts-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Convert text into a single combined MP3 Audio Buffer using Google TTS
 */
async function convertTextToMp3Buffer(text, lang = 'en', slow = false) {
  if (!text || text.trim().length === 0) {
    throw new Error('Text parameter is required.');
  }

  // Automatically chunks text by punctuation & length
  const base64Results = await googleTTS.getAllAudioBase64(text, {
    lang: lang || 'en',
    slow: Boolean(slow),
    host: 'https://translate.google.com',
    timeout: 10000,
    splitPunct: '.,!?;'
  });

  // Combine all base64 chunks into a single binary Buffer
  const buffers = base64Results.map(item => Buffer.from(item.base64, 'base64'));
  return Buffer.concat(buffers);
}

/**
 * POST /api/tts
 * Body: { text: "Hello", lang: "en", slow: false, format: "binary" | "base64" }
 */
app.post('/api/tts', async (req, res) => {
  try {
    const { text, lang = 'en', slow = false, format = 'binary' } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text field is required and must be a non-empty string.' });
    }

    const audioBuffer = await convertTextToMp3Buffer(text.trim(), lang, slow);

    if (format === 'base64') {
      const base64Data = audioBuffer.toString('base64');
      return res.json({
        success: true,
        mimeType: 'audio/mpeg',
        audioBase64: `data:audio/mpeg;base64,${base64Data}`
      });
    }

    // Default: Return MP3 binary audio stream
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Content-Disposition': 'inline; filename="speech.mp3"',
      'Cache-Control': 'no-cache'
    });

    res.send(audioBuffer);

  } catch (error) {
    console.error('TTS Conversion Error:', error);
    res.status(500).json({ 
      error: 'Failed to convert text to speech', 
      details: error.message 
    });
  }
});

/**
 * GET /api/tts?text=...&lang=...&slow=...
 * Direct stream endpoint suitable for <audio src="...">
 */
app.get('/api/tts', async (req, res) => {
  try {
    const { text, lang = 'en', slow = 'false' } = req.query;

    if (!text) {
      return res.status(400).send('Text query parameter is required.');
    }

    const isSlow = slow === 'true' || slow === '1';
    const audioBuffer = await convertTextToMp3Buffer(text.toString(), lang.toString(), isSlow);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Content-Disposition': 'inline; filename="speech.mp3"',
      'Cache-Control': 'public, max-age=3600'
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error('GET TTS Error:', error);
    res.status(500).send('Error generating audio stream');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Google TTS (Node.js Service)', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Node.js Text-to-Speech API Server running!`);
  console.log(`🔊 Local Server: http://localhost:${PORT}`);
  console.log(`🎙️ POST Endpoint: http://localhost:${PORT}/api/tts`);
  console.log(`==================================================`);
});
