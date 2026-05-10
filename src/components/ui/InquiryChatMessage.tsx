// src/components/inquiry/InquiryChatMessage.tsx

import React from 'react';
import clsx from 'clsx';
import type { InquiryMessage } from '../../types/inquiry';
import { InquiryAvatar } from './InquiryAvatar';

interface Props {
  message: InquiryMessage;
  customerName: string;
}

export const InquiryChatMessage: React.FC<Props> = ({ message, customerName }) => {
  const msgSender = (message as any).user || message.from;
  const isUser  = msgSender === 'user';
  const isAdmin = msgSender === 'admin';

  // System / auto messages — centred pill
  if (msgSender === 'system') {
    return (
      <div className="flex justify-center my-1">
        <div
          className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full max-w-sm text-center leading-relaxed"
          dangerouslySetInnerHTML={message.isHtml ? { __html: message.text } : undefined}
        >
          {!message.isHtml ? message.text : undefined}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex gap-2.5 max-w-[80%] animate-[msgIn_0.25s_ease_both]',
        isUser ? 'self-start' : 'self-end flex-row-reverse'
      )}
      style={{ ['--tw-animate-name' as string]: 'msgIn' }}
    >
      <InquiryAvatar
        name={isUser ? customerName : 'A'}
        size="sm"
        variant={isUser ? 'user' : 'admin'}
      />

      <div className="flex flex-col gap-1">
        <div
          className={clsx(
            'px-4 py-2.5 text-sm leading-relaxed break-words',
            isUser
              ? 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
              : 'bg-blue-600 text-white rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl'
          )}
        >
          {message.isHtml
            ? <span dangerouslySetInnerHTML={{ __html: message.text }} />
            : message.text}
        </div>
        <p className={clsx('text-[10px] text-slate-500 px-1', !isUser && 'text-right')}>
          {message.time}
        </p>
      </div>
    </div>
  );
};
