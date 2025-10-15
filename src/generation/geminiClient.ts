import { GoogleGenAI } from "@google/genai";

export async function runGemini(prompt: string, userApiKey: string) {
    // Use user-provided API key if available, otherwise fall back to environment variable
    const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing Gemini API key. Please add your API key in Settings.");
    }

    try {
        const genAI = new GoogleGenAI({ apiKey });
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
