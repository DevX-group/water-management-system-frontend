// src/components/inquiry/InquiryTypingIndicator.tsx

import React from 'react';
import { InquiryAvatar } from './InquiryAvatar';

export const InquiryTypingIndicator: React.FC = () => (
  <div className="flex gap-2.5 self-start">
    <InquiryAvatar name="A" size="sm" variant="admin" />
    <div className="flex items-center gap-1 bg-white/8 border border-white/10 px-4 py-3 rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </div>
  </div>
);
