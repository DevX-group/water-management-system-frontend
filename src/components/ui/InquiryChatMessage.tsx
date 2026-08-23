import '@/index.css';
// src/components/inquiry/InquiryChatMessage.tsx

import React from 'react';
import clsx from 'clsx';
import type { InquiryMessage } from '../../types/inquiry';
import { InquiryAvatar } from './InquiryAvatar';

interface Props {
  message: InquiryMessage;
  customerName: string;
  viewerRole?: 'user' | 'admin'; // defaults to 'user'
}

export const InquiryChatMessage: React.FC<Props> = ({ message, customerName, viewerRole = 'user' }) => {
  const msgSender = (message as any).user || message.from;
  const isMyMessage = msgSender === viewerRole;
  const isCustomerSender = msgSender === 'user';

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
        isMyMessage ? 'self-end flex-row-reverse' : 'self-start'
      )}
      style={{ ['--tw-animate-name' as string]: 'msgIn' }}
    >
      <InquiryAvatar
        name={isCustomerSender ? customerName : 'A'}
        size="sm"
        variant={isCustomerSender ? 'user' : 'admin'}
      />

      <div className="flex flex-col gap-1">
        <div
          className={clsx(
            'px-4 py-2.5 text-sm leading-relaxed break-words',
            isMyMessage
              ? (viewerRole === 'user' ? 'bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl' : 'bg-primary text-white rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl')
              : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
          )}
        >
          {message.attachmentUrl && (
            <div className="mb-2">
              {message.attachmentUrl.toLowerCase().endsWith('.pdf') ? (
                <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border hover:bg-background/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13a2 2 0 1 0 0 4h1v-4h-1z"/><path d="M16 13h-2v4h2"/><path d="M16 15h-2"/><path d="M6 13v4"/><path d="M6 15h2"/></svg>
                  <span className="text-sm font-medium underline underline-offset-2 text-primary">View PDF Document</span>
                </a>
              ) : message.attachmentUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/) != null || !message.attachmentUrl.includes('.') ? (
                <img src={message.attachmentUrl} alt="attachment" className="max-w-full rounded-lg object-contain cursor-pointer" onClick={() => window.open(message.attachmentUrl, '_blank')} style={{ maxHeight: '200px' }} />
              ) : (
                <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border hover:bg-background/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="text-sm font-medium underline underline-offset-2 text-primary">Download File</span>
                </a>
              )}
            </div>
          )}
          {message.isHtml
            ? <span dangerouslySetInnerHTML={{ __html: message.text }} />
            : message.text}
        </div>
        <p className={clsx('text-[10px] text-slate-500 px-1', isMyMessage && 'text-right')}>
          {message.time}
        </p>
      </div>
    </div>
  );
};
