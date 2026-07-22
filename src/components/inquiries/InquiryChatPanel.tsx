import '@/index.css';
import React, { RefObject } from 'react';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InquiryChatMessage } from '@/components/ui/InquiryChatMessage';
import { InquiryAvatar } from '@/components/ui/InquiryAvatar';
import type { Inquiry } from '@/types/inquiry';

interface InquiryChatPanelProps {
  selectedInquiry: Inquiry | null;
  replyText:       string;
  setReplyText:    (v: string) => void;
  messagesEndRef:  RefObject<HTMLDivElement>;
  onSendReply:     () => void;
  onResolve:       (id: string) => void;
}

export const InquiryChatPanel: React.FC<InquiryChatPanelProps> = ({
  selectedInquiry, replyText, setReplyText,
  messagesEndRef, onSendReply, onResolve,
}) => {
  return (
    <Card className="shadow-card border-none h-full flex flex-col overflow-hidden bg-card">
      {!selectedInquiry ? (    // Empty State when no inquiry is selected
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
          <MessageSquare size={48} className="opacity-10 mb-4" />
          <h3 className="text-lg font-medium">No Inquiry Selected</h3>
          <p className="text-sm max-w-xs">Select a conversation from the list to view history and respond.</p>
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
                  <CheckCircle className="w-3 h-3 mr-1" /> Resolve
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
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your response..."
                  rows={2}
                  className="w-full rounded-xl border-none bg-background p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none shadow-inner"
                />
              </div>
              <Button
                className="h-12 w-12 rounded-xl gradient-primary"
                disabled={!replyText.trim()}
                onClick={onSendReply}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
