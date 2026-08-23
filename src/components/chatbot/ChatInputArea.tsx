import { Send, Mic, MicOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatInputAreaProps {
  input: string;
  isLoading: boolean;
  setInput: (value: string | ((prev: string) => string)) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export const ChatInputArea = ({
  input,
  isLoading,
  setInput,
  handleSend,
  handleKeyDown,
}: ChatInputAreaProps) => {
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechSupport(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev: string) => prev ? prev + ' ' + transcript : transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [setInput]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    }
  };

  return (
    <div className="p-3 bg-background border-t border-border flex items-end gap-2">
      {hasSpeechSupport && (
        <button
          onClick={toggleListening}
          className={'p-2 rounded-xl transition-colors shrink-0 flex items-center justify-center h-10 w-10 ' + 
            (isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}
          title={isListening ? "Stop listening" : "Use voice input"}
          type="button"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      )}
      
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Listening..." : "Ask me anything..."}
        className="flex-1 max-h-32 min-h-[40px] resize-none rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="shrink-0 p-2 rounded-xl bg-primary text-primary-foreground flex items-center justify-center h-10 w-10 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};
