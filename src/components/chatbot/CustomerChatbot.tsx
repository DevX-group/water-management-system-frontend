import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import { CUSTOMER_SUBSCRIPTION_NUMBER } from '../../constants/customer';

import { ChatToggleButton } from './ChatToggleButton';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputArea } from './ChatInputArea';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const CustomerChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'bot', text: 'Hello! I am your Water Management Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/chatbot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          subscriptionNumber: CUSTOMER_SUBSCRIPTION_NUMBER
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: data.response }]);
      } else {
        throw new Error('Failed to fetch response');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'bot', 
        text: 'Sorry, I am having trouble connecting to the server right now.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <ChatToggleButton isOpen={isOpen} toggleChat={toggleChat} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-primary-foreground flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/20 rounded-full">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Water Assistant AI</h3>
              </div>
            </div>

            <ChatMessageList 
              messages={messages} 
              isLoading={isLoading} 
              messagesEndRef={messagesEndRef} 
            />

            <ChatInputArea 
              input={input} 
              isLoading={isLoading} 
              setInput={setInput} 
              handleSend={handleSend} 
              handleKeyDown={handleKeyDown} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
