import { motion } from 'framer-motion';
import { BookOpenText, X } from 'lucide-react';

interface ChatToggleButtonProps {
  isOpen: boolean;
  toggleChat: () => void;
}

export const ChatToggleButton = ({ isOpen, toggleChat }: ChatToggleButtonProps) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-50 flex items-center justify-center group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleChat}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <div className="relative flex items-center justify-center">
          <BookOpenText className="w-6 h-6" />
        </div>
      )}
    </motion.button>
  );
};
