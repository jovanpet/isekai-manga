import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing Gemini API key");

const genAI = new GoogleGenAI({ apiKey });

export async function runGemini(prompt: string) {
    try {
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return result.text || "";
    } catch (err) {
        console.error("Gemini generation failed:", err);
        throw err;
    }
}
