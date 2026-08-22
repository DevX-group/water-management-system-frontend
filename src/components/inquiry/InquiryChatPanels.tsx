import '@/index.css';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { InquiryChatMessage } from '@/components/ui/InquiryChatMessage';
import { InquiryTypingIndicator } from '@/components/ui/InquiryTypingIndicator';
import { InquiryAvatar } from '@/components/ui/InquiryAvatar';
import { StatusBadge } from './InquiryHistoryList';
import type { Inquiry } from '@/types/inquiry';

interface InquiryChatPanelsProps {
  inquiry: Inquiry;
  isHistory?: boolean;
  onBack?: () => void;
  chatInput?: string;
  setChatInput?: (v: string) => void;
  onSendMessage?: () => void;
  showTyping?: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

import { Trans, useTranslation } from 'react-i18next';

export const InquiryChatPanels: React.FC<InquiryChatPanelsProps> = ({
  inquiry, isHistory, onBack, chatInput, setChatInput, onSendMessage, showTyping, messagesEndRef
}) => {
  const { t } = useTranslation('inquiry');
  return (
  <Card className="shadow-card border-none overflow-hidden h-[600px] flex flex-col bg-card">
    <CardHeader className="bg-secondary/20 border-b flex flex-row items-center gap-4 py-4">
      {isHistory ? (
        <>
          <Button variant="ghost" size="sm" className="rounded-full" onClick={onBack}><ChevronLeft size={16} /></Button>
          <div className="flex-1">
            <CardTitle className="text-base">{t('chat.historyTitle', { category: inquiry.category ? t(`categories.${inquiry.category}`) : t('history.general') })}</CardTitle>
            <p className="text-xs text-muted-foreground">{inquiry.id}</p>
          </div>
          <StatusBadge status={inquiry.status} />
        </>
      ) : (
        <>
          <InquiryAvatar name="S" size="sm" variant="admin" />
          <div>
            <CardTitle className="text-base">{t('chat.liveSupportTitle')}</CardTitle>
            <p className="text-xs text-success font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> {t('chat.connected')}
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto">ID: {inquiry.id}</Badge>
        </>
      )}
    </CardHeader>
    <CardContent className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {inquiry.messages.map((msg) => <InquiryChatMessage key={msg.id} message={msg} customerName={inquiry.name} />)}
      {!isHistory && showTyping && <InquiryTypingIndicator />}
      <div ref={messagesEndRef} />
    </CardContent>
    {isHistory ? (
      inquiry.status.toLowerCase() === 'open' ? (
        <div className="p-4 bg-secondary/10 border-t">
          <div className="flex gap-2">
            <textarea value={chatInput} onChange={(e) => setChatInput?.(e.target.value)} placeholder={t('chat.typePlaceholder')} className="flex-1 bg-card border border-input rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none min-h-[50px] shadow-inner" />
            <Button onClick={onSendMessage} disabled={!chatInput?.trim()} className="h-auto px-6 rounded-xl gradient-primary">
              <Send size={18} />
            </Button>
          </div>
        </div>
      ) : inquiry.status.toLowerCase() === 'resolved' ? (  // Show resolved banner if inquiry is resolved
        <div className="p-4 bg-success/5 border-t flex items-center justify-center gap-2 text-success">
          <CheckCircle size={16} /><span className="text-xs font-medium">{t('chat.resolvedBanner')}</span>
        </div>
      ) : (
        <div className="p-4 bg-secondary/10 border-t">
          <p className="text-xs text-muted-foreground text-center italic">
            <Trans i18nKey="chat.statusBanner" t={t} values={{ status: t(`status.${inquiry.status.toLowerCase()}`) || inquiry.status }}>
              This inquiry is currently <strong>{{status: inquiry.status}}</strong>. Our team will respond shortly.
            </Trans>
          </p>
        </div>
      )
    ) : (
      <div className="p-4 bg-secondary/10 border-t">
        <div className="flex gap-2">
          <textarea value={chatInput} onChange={(e) => setChatInput?.(e.target.value)} placeholder={t('chat.typePlaceholder')} className="flex-1 bg-card border border-input rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none min-h-[50px] shadow-inner" />
          <Button onClick={onSendMessage} disabled={!chatInput?.trim()} className="h-auto px-6 rounded-xl gradient-primary">
            <Send size={18} />
          </Button>
        </div>
      </div>
    )}
  </Card>
  );
};
