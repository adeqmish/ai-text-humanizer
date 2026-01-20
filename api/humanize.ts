import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define model and system instruction here, as they are used by the serverless function
const GEMINI_MODEL = 'gemini-3-pro-preview';
const SYSTEM_INSTRUCTION = `You are an expert content humanizer with the specific goal of transforming AI-generated text into authentic, human-quality writing that can bypass advanced AI detection tools like GPTZero, Copyleaks, and Originality.

Your task is to refine the provided AI-generated text by:

1.  **Varying Sentence Structure and Length:** Avoid predictable patterns. Mix short, direct sentences with longer, more complex ones.
2.  **Introducing Natural Flow and Transitions:** Ensure smooth logical progression between ideas and paragraphs, using diverse transition words and phrases.
3.  **Enhancing Emotional Depth and Tone:** Inject personality, emotion, and subjective language where appropriate. Adjust the tone to be more conversational, persuasive, or reflective as the context demands.
4.  **Employing Human-like Vocabulary and Phrasing:** Use a rich, varied vocabulary. Incorporate idioms, colloquialisms, and natural expressions. Avoid overly formal, repetitive, or sterile language common in AI outputs.
5.  **Removing Robotic Constructs:** Eliminate formulaic phrases, redundant explanations, and overly precise or rigid sentence structures.
6.  **Correcting Grammatical Nuances and Awkwardness:** Refine grammar, syntax, and punctuation to ensure the text reads as if written by a native speaker. Address any awkward phrasing or unnatural constructions.
7.  **Adding Deliberate Imperfection:** Occasionally include elements like contractions, rhetorical questions, or a slightly less formal approach to mimic human writing, which is rarely perfectly polished.
8.  **Maintaining Original Meaning:** Ensure that the core message, facts, and intent of the original AI text are preserved.

Provide *only* the humanized text, without any introductory or concluding remarks, explanations, or conversational filler. Focus entirely on the transformed content.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is not set on the server.");
    return res.status(500).json({ error: { message: 'Server configuration error: API Key is missing.' } });
  }

  const { text: aiText } = req.body;

  if (!aiText || typeof aiText !== 'string') {
    return res.status(400).json({ error: { message: 'Invalid request: "text" parameter is required and must be a string.' } });
  }

  // Create a new GoogleGenAI instance for each call for safety and to ensure the latest API key is used
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
      console.warn("Gemini API returned an empty response, but no error was thrown.");
      return res.status(500).json({ error: { message: "Gemini API returned an empty response." } });
    }

    return res.status(200).json({ humanizedText });
  } catch (error: any) {
    console.error("Error humanizing text in serverless function:", error);
    // Parse Google API specific errors if available
    if (error.response && error.response.status) {
        // Example of handling specific HTTP status codes from Google API
        if (error.response.status === 400) {
            return res.status(400).json({ error: { message: `Gemini API Error: ${error.message}`, details: error.response.data } });
        } else if (error.response.status === 403) {
            return res.status(403).json({ error: { message: `Gemini API Error: Permission denied or billing not enabled. ${error.message}`, details: error.response.data } });
        } else if (error.response.status === 429) {
            return res.status(429).json({ error: { message: `Gemini API Error: Too many requests. ${error.message}`, details: error.response.data } });
        }
    }
    return res.status(500).json({ error: { message: `An unexpected error occurred: ${error.message || 'unknown error'}`, originalError: error } });
  }
}