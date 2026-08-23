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
import { api } from '@/services/api';

interface InquiryChatPanelsProps {
  inquiry: Inquiry;
  isHistory?: boolean;
  onBack?: () => void;
  chatInput?: string;
  setChatInput?: (v: string) => void;
  onSendMessage?: (attachmentUrl?: string) => void;
  showTyping?: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

import { Trans, useTranslation } from 'react-i18next';

export const InquiryChatPanels: React.FC<InquiryChatPanelsProps> = ({
  inquiry, isHistory, onBack, chatInput, setChatInput, onSendMessage, showTyping, messagesEndRef
}) => {
  const { t } = useTranslation('inquiry');
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!chatInput?.trim() && !file) return;
    let attachmentUrl = undefined;
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await api.post('/inquiries/upload-attachment', formData);
        attachmentUrl = res.data.url;
      } catch (e) {
        console.error('File upload failed', e);
      } finally {
        setUploading(false);
      }
    }
    if (onSendMessage) {
      onSendMessage(attachmentUrl);
    }
    setFile(null);
  };

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
    {inquiry.status.toLowerCase() === 'open' ? (
      <div className="p-4 bg-secondary/10 border-t">
        {file && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-secondary/30 rounded-md">
            <span className="text-xs truncate">{file.name}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto" onClick={() => setFile(null)}>✕</Button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <input type="file" ref={fileInputRef} className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          <Button variant="outline" size="icon" className="shrink-0 h-[50px] w-[50px] rounded-xl" onClick={() => fileInputRef.current?.click()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </Button>
          <textarea value={chatInput} onChange={(e) => setChatInput?.(e.target.value)} placeholder={t('chat.typePlaceholder')} className="flex-1 bg-card border border-input rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none min-h-[50px] shadow-inner" />
          <Button onClick={handleSend} disabled={(!chatInput?.trim() && !file) || uploading} className="h-[50px] px-6 rounded-xl gradient-primary">
            {uploading ? '...' : <Send size={18} />}
          </Button>
        </div>
      </div>
    ) : inquiry.status.toLowerCase() === 'resolved' ? (
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
    )}
  </Card>
  );
};
