import React from 'react';
import { Info } from 'lucide-react';

const TIPS = [
  'Record all visible digits including zeros',
  'Ignore the red dial if present',
  'Read from left to right',
  'Take a photo for your records',
];

export const MeterReadingInstructions: React.FC = () => (
  <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
    <div className="flex items-center gap-2 mb-4">
      <Info className="w-5 h-5 text-primary" />
      <h3 className="font-semibold text-foreground">How to read your meter</h3>
    </div>
    <ul className="space-y-3">
      {TIPS.map((tip, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
            {i + 1}
          </span>
          {tip}
        </li>
      ))}
    </ul>
  </div>
);
