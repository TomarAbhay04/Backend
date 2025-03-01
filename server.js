import express from "express";
import cors from "cors";
import "dotenv/config";
import googleTTS from "google-tts-api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// AI Response using Gemini API
app.post("/ask", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text.trim()) {
            return res.status(400).json({ error: "Empty text received" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(text);
        const response = await result.response;
        const aiText = response.text();

        res.json({ answer: aiText });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI Failed" });
    }
});

// Text-to-Speech (TTS) using Google TTS API
app.post("/tts", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text.trim()) {
            return res.status(400).json({ error: "Empty text for TTS" });
        }

        const url = googleTTS.getAudioUrl(text, { lang: "en", slow: false });

        res.json({ audioUrl: url });
    } catch (error) {
        console.error("TTS Error:", error);
        res.status(500).json({ error: "TTS Failed" });
    }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
