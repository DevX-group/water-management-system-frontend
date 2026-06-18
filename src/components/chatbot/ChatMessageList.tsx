import { Bot, User, Loader2 } from 'lucide-react';
import { RefObject } from 'react';
import { ChatMessage } from './CustomerChatbot';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export const ChatMessageList = ({ messages, isLoading, messagesEndRef }: ChatMessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
        >
          <div className={`p-2 rounded-full flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <div 
            className={`p-3 rounded-2xl max-w-[80%] text-sm ${
              msg.sender === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-background border border-border shadow-sm rounded-tl-sm'
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-start gap-2">
          <div className="p-2 rounded-full bg-muted text-muted-foreground">
            <Bot className="w-4 h-4" />
          </div>
          <div className="p-3 bg-background border border-border shadow-sm rounded-2xl rounded-tl-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Thinking...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
