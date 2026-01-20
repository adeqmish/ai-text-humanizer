/**
 * Humanizes AI-generated text by calling a serverless API endpoint.
 * @param aiText The AI-generated text to humanize.
 * @returns A promise that resolves with the humanized text, or rejects with an error.
 */
export const humanizeText = async (aiText: string): Promise<string> => {
  try {
    const response = await fetch('/api/humanize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: aiText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to humanize text: ${errorData.error.message || response.statusText}`);
    }

    const data = await response.json();
    const humanizedText = data.humanizedText;

    if (!humanizedText) {
      throw new Error("Serverless API returned an empty response.");
    }

    return humanizedText;
  } catch (error: unknown) {
    console.error("Error humanizing text:", error);
    if (error instanceof Error) {
      throw new Error(`An error occurred: ${error.message}`);
    }
    throw new Error("An unknown error occurred while humanizing text.");
  }
};
