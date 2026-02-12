import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize the Gemini AI client
// Note: We use process.env.API_KEY as per the requirements.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  try {
    // We use gemini-3-flash-preview for fast, responsive chat interactions
    const model = 'gemini-3-flash-preview';

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9, // Creative and fun
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Oof! Something went wrong in my neural pathways. Try again later! 🦔";
  }
};