import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderSectionProps {
  title: string;
}

export const PlaceholderPage = ({ title }: PlaceholderSectionProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-glow">
        <Construction className="w-10 h-10 text-primary-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        This section is under development. Check back soon for updates!
      </p>
    </div>
  );
};
