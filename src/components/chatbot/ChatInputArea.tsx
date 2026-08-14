import { Send } from 'lucide-react';

interface ChatInputAreaProps {
  input: string;
  isLoading: boolean;
  setInput: (value: string) => void;
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
  return (
    <div className="p-3 bg-background border-t border-border flex items-end gap-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        className="flex-1 max-h-32 min-h-[40px] resize-none rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};
