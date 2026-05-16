import '@/index.css';
// src/components/inquiry/InquiryAvatar.tsx

import React from 'react';
import clsx from 'clsx';

interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'user' | 'admin';
}

const SIZE: Record<string, string> = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export const InquiryAvatar: React.FC<Props> = ({ name, size = 'md', variant = 'user' }) => (
  <div
    className={clsx(
      'rounded-full flex items-center justify-center font-bold flex-shrink-0',
      SIZE[size],
      variant === 'user'
        ? 'bg-gradient-to-br from-primary to-accent text-white'
        : 'bg-gradient-to-br from-violet-500 to-pink-400 text-white'
    )}
  >
    {name?.charAt(0)?.toUpperCase() ?? '?'}
  </div>
);
