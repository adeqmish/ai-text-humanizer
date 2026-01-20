import React, { useState, useCallback } from 'react';
import Button from './components/Button';
import TextArea from './components/TextArea';
import { humanizeText } from './services/geminiService';
import { APP_NAME, APP_TAGLINE } from './constants';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [humanizedOutput, setHumanizedOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleHumanize = useCallback(async () => {
    setError(null);
    setLoading(true);
    setHumanizedOutput(''); // Clear previous output

    try {
      const result = await humanizeText(inputText);
      setHumanizedOutput(result);
    } catch (err: unknown) {
      console.error("Humanize error:", err);
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  return (
    <div className="flex flex-col min-h-screen items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-6xl text-center py-10 md:py-16">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-textPrimary mb-5 leading-tight">
          {APP_NAME}
        </h1>
        <p className="text-xl sm:text-2xl text-textSecondary mb-8 max-w-4xl mx-auto font-medium">
          {APP_TAGLINE}
        </p>
        <p className="text-md sm:text-lg text-textSecondary leading-relaxed max-w-3xl mx-auto">
          This tool refines and transforms AI-generated content for better readability and engagement. Improve AI instantly. AI humanizer transforms ChatGPT, Claude, Deepseek, Gemini, or any AI text into human-like content—extensively tested on Copyleaks, GPTZero, Originality, and more. Trusted by professionals for quality results without AI.
        </p>
      </header>

      <main className="flex-grow w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col">
          <TextArea
            label="Paste your AI text here:"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g., 'The autonomous vehicle navigated the urban landscape with optimal efficiency, utilizing real-time sensor data for precise trajectory planning and obstacle avoidance.'"
            rows={15}
            className="min-h-[300px]"
          />
        </div>

        <div className="flex flex-col">
          <TextArea
            label="Humanized Output:"
            value={humanizedOutput}
            readOnly
            placeholder="Your humanized text will appear here. No more grammatical errors or low-quality output. This humanizer has the highest quality outputs in the industry."
            rows={15}
            className="bg-gray-50 min-h-[300px]"
          />
        </div>
      </main>

      <div className="w-full max-w-6xl flex justify-center py-6 sticky bottom-0 z-10">
        <Button
          onClick={handleHumanize}
          disabled={!inputText.trim()}
          loading={loading}
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 min-h-[50px]"
        >
          {loading ? 'Humanizing...' : 'Humanize Text'}
        </Button>
      </div>

      {error && (
        <div className="w-full max-w-4xl mt-8 p-6 bg-red-50 border border-red-500 text-red-800 rounded-xl text-center shadow-lg">
          <p className="font-semibold text-lg mb-2">Error: {error}</p>
          <p className="text-md">
            If the error is "Requested entity was not found.", please ensure your API key is correctly configured and has billing enabled.
            You may need to select a paid API key via the AI Studio interface.
          </p>
        </div>
      )}

      <footer className="w-full max-w-6xl text-center py-10 bg-blue-100 border-t-2 border-primary mt-16 text-md text-textSecondary rounded-t-lg">
        <p className="mb-2">This tool utilizes advanced AI models for text humanization. While it aims to produce authentic, human-quality writing, it relies on AI assistance.</p>
        <p className="mb-2">Extensively tested on tools like GPTZero, Copyleaks, and Originality (claims cannot be guaranteed by this tool, but the intent is to produce high-quality humanized text).</p>
        <p className="mt-4 text-sm">Learn more about <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-blue-700 underline transition-colors duration-200">API billing</a>.</p>
      </footer>
    </div>
  );
};

export default App;