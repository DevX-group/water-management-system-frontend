// src/components/inquiry/InquiryCategoryBadge.tsx

import React from 'react';
import type { InquiryCategory } from '../../types/inquiry';

interface Props { category: InquiryCategory }

const ICONS: Record<InquiryCategory, string> = {
  Billing:   '💳',
  Technical: '🔧',
  Account:   '👤',
  Shipping:  '📦',
  Refund:    '↩️',
  General:   '💬',
};

export const InquiryCategoryBadge: React.FC<Props> = ({ category }) => (
  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 border border-white/10 px-2 py-0.5 rounded-md bg-white/5">
    <span>{ICONS[category]}</span>
    {category}
  </span>
);
