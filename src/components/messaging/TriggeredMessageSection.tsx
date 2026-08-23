import '@/index.css';
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { MessagingEnumResponse, TriggeredMessage } from '@/types/messaging';
import * as messageApi from '@/services/messageService';
import { TriggeredMessageCard } from '@/components/messaging/TriggeredMessageCard';
import { MessageDialog } from '@/components/messaging/MessageDialog';

type TriggeredMessageSectionProps = {
  enumOptions: MessagingEnumResponse | null;
};

export const TriggeredMessageSection: React.FC<TriggeredMessageSectionProps> = ({ enumOptions }) => {
  const { t } = useTranslation('messaging');
  // Server-backed list of triggered message templates.
  const [triggeredMessages, setTriggeredMessages] = useState<TriggeredMessage[]>([]);
  const [isLoading, setIsLoading]                 = useState(true);
  const [isDialogOpen, setIsDialogOpen]           = useState(false);
  const [editingMessage, setEditingMessage]       = useState<TriggeredMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch of triggered templates.
    const load = async () => {
      try {
        const triggered = await messageApi.getAllTriggeredMessages();
        setTriggeredMessages(triggered);
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : t('common.loadingMessages');
        toast({ title: t('common.error'), description: message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [toast, t]);

  const handleDelete = async (id: string) => {
    // Delete and prune the list locally on success.
    try {
      await messageApi.deleteTriggeredMessage(id);
      setTriggeredMessages(prev => prev.filter(m => m.id !== id));
      toast({ title: t('toasts.deletedTitle'), description: t('toasts.triggeredDeletedDesc') });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : t('toasts.failedDelete');
      toast({ title: t('common.error'), description: message, variant: 'destructive' });
    }
  };

  const handleSave = async (message: TriggeredMessage) => {
    // Create or update based on whether we're editing an existing message.
    try {
      if (editingMessage) {
        const updated = await messageApi.updateTriggeredMessage(message.id, message);
        setTriggeredMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
        toast({ title: t('toasts.updatedTitle'), description: t('toasts.updatedDesc') });
      } else {
        const created = await messageApi.createTriggeredMessage(message);
        setTriggeredMessages(prev => [...prev, created]);
        toast({ title: t('toasts.createdTitle'), description: t('toasts.triggeredCreatedDesc') });
      }
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : t('toasts.failedSave');
      toast({ title: t('common.error'), description: message, variant: 'destructive' });
    }
    setIsDialogOpen(false);
    setEditingMessage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <Button className="h-auto py-2 px-4 whitespace-normal" onClick={() => { setEditingMessage(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4 shrink-0" /> {t('triggeredSection.newMessage')}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t('common.loadingMessages')}</div>
      ) : triggeredMessages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t('triggeredSection.empty')}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {triggeredMessages.map((message) => (
            <TriggeredMessageCard
              key={message.id}
              message={message}
              onEdit={() => { setEditingMessage(message); setIsDialogOpen(true); }}
              onDelete={() => handleDelete(message.id)}
            />
          ))}
        </div>
      )}

      {isDialogOpen && (
        <MessageDialog
          isOpen={isDialogOpen}
          mode="triggered"
          onClose={() => setIsDialogOpen(false)}
          initialData={editingMessage}
          onSave={handleSave as any}
          enumOptions={enumOptions}
        />
      )}
    </div>
  );
};
