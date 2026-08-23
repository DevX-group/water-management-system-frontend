import '@/index.css';
import React, { RefObject } from 'react';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InquiryChatMessage } from '@/components/ui/InquiryChatMessage';
import { InquiryAvatar } from '@/components/ui/InquiryAvatar';
import type { Inquiry } from '@/types/inquiry';
import { api } from '@/services/api';

interface InquiryChatPanelProps {
  selectedInquiry: Inquiry | null;
  replyText:       string;
  setReplyText:    (v: string) => void;
  messagesEndRef:  RefObject<HTMLDivElement>;
  onSendReply:     (attachmentUrl?: string) => void;
  onResolve:       (id: string) => void;
}

import { useTranslation } from 'react-i18next';

export const InquiryChatPanel: React.FC<InquiryChatPanelProps> = ({
  selectedInquiry, replyText, setReplyText,
  messagesEndRef, onSendReply, onResolve,
}) => {
  const { t } = useTranslation('inquiry');
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!replyText.trim() && !file) return;
    let attachmentUrl = undefined;
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await api.post('/inquiries/upload-attachment', formData);  // Upload the file to the server
        attachmentUrl = res.data.url;
      } catch (e) {
        console.error('File upload failed', e);
      } finally {
        setUploading(false);
      }
    }
    onSendReply(attachmentUrl);
    setFile(null);
  };

  return (
    <Card className="shadow-card border-none h-full flex flex-col overflow-hidden bg-card">
      {!selectedInquiry ? (    // Empty State when no inquiry is selected
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
          <MessageSquare size={48} className="opacity-10 mb-4" />
          <h3 className="text-lg font-medium">{t('admin.noInquirySelected')}</h3>
          <p className="text-sm max-w-xs">{t('admin.noInquiryDesc')}</p>
        </div>
      ) : (
        <>
          {/*Header  */} 
          <div className="p-4 border-b flex items-center justify-between bg-secondary/20">
            <div className="flex items-center gap-3">
              <InquiryAvatar name={selectedInquiry.name} size="sm" variant="user" />
              <div>
                <p className="font-bold text-sm">{selectedInquiry.name}</p>
                <p className="text-[10px] text-muted-foreground">{selectedInquiry.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {selectedInquiry.status !== 'resolved' && (  // Show Resolve button only if inquiry is not already resolved
                <Button variant="outline" size="sm" onClick={() => onResolve(selectedInquiry.id)}>
                  <CheckCircle className="w-3 h-3 mr-1" /> {t('admin.resolveBtn')}
                </Button>
              )}
              <Badge className={selectedInquiry.status === 'open' ? 'bg-primary' : 'bg-success'}>
                {selectedInquiry.status.toUpperCase()}
              </Badge>
            </div>
          </div>

           {/*Messages */} 
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {selectedInquiry.messages.map((msg, index) => (
              <InquiryChatMessage
                key={`${selectedInquiry.id}-${index}`}
                message={msg}
                customerName={selectedInquiry.name}
                viewerRole="admin"
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/*Reply input  */} 
          <div className="p-4 border-t bg-secondary/10">
            {file && (
              <div className="flex items-center gap-2 mb-2 p-2 bg-secondary/30 rounded-md">
                <span className="text-xs truncate">{file.name}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto" onClick={() => setFile(null)}>✕</Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Button variant="outline" size="icon" className="shrink-0 h-12 w-12 rounded-xl" onClick={() => fileInputRef.current?.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </Button>
              <div className="flex-1 relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t('admin.writeResponse')}
                  rows={1}
                  className="w-full rounded-xl border-none bg-background p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none shadow-inner min-h-[48px]"
                />
              </div>
              <Button
                className="h-12 px-6 rounded-xl gradient-primary"
                disabled={(!replyText.trim() && !file) || uploading}
                onClick={handleSend}
              >
                {uploading ? '...' : <Send size={18} />}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
