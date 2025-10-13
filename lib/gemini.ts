import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function testGeminiConnection() {
  try {
    console.log('Testing Gemini API connection...');
    console.log('API Key configured:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');

    // Mock call - would actually call the API if key is valid
    const mockResponse = {
      text: "This is a mock response from Gemini API",
      timestamp: new Date().toISOString()
    };

    console.log('Mock Gemini response:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error('Error testing Gemini connection:', error);
    throw error;
  }
}