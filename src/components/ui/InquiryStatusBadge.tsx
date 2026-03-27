// src/components/inquiry/InquiryStatusBadge.tsx

import React from 'react';
import clsx from 'clsx';
import type { InquiryStatus } from '../../types/inquiry';

interface Props {
  status: InquiryStatus;
  size?: 'sm' | 'md';
}

const CONFIG: Record<InquiryStatus, { label: string; cls: string }> = {
  open:     { label: 'Open',     cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  pending:  { label: 'Pending',  cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  resolved: { label: 'Resolved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
};

export const InquiryStatusBadge: React.FC<Props> = ({ status, size = 'sm' }) => {
  const { label, cls } = CONFIG[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold uppercase tracking-wider rounded-md border',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        cls
      )}
    >
      {label}
    </span>
  );
};
