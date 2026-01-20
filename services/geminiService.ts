import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from '../constants';

/**
 * Humanizes AI-generated text using the Gemini API.
 * @param aiText The AI-generated text to humanize.
 * @returns A promise that resolves with the humanized text, or rejects with an error.
 */
export const humanizeText = async (aiText: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  // Create a new GoogleGenAI instance for each call to ensure the API key is fresh
  // in case it was selected/updated via window.aistudio.openSelectKey()
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ parts: [{ text: aiText }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const humanizedText = response.text;
    if (!humanizedText) {
      throw new Error("Gemini API returned an empty response.");
    }

    return humanizedText;
  } catch (error: unknown) {
    console.error("Error humanizing text:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to humanize text: ${error.message}`);
    }
    throw new Error("An unknown error occurred while humanizing text.");
  }
};