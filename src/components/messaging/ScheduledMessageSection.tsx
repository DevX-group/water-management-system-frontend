import '@/index.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { MessagingEnumResponse, ScheduledMessage } from '@/types/messaging';
import * as messageApi from '@/services/messageService';
import { ScheduledMessageCard } from '@/components/messaging/ScheduledMessageCard';
import { MessageDialog } from '@/components/messaging/MessageDialog';

type ScheduledMessageSectionProps = {
  enumOptions: MessagingEnumResponse | null;
};

export const ScheduledMessageSection: React.FC<ScheduledMessageSectionProps> = ({ enumOptions }) => {
  const { t } = useTranslation('messaging');
  // Server-backed list of scheduled messages.
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading]                 = useState(true);
  const [isDialogOpen, setIsDialogOpen]           = useState(false);
  const [editingMessage, setEditingMessage]       = useState<ScheduledMessage | null>(null);
  const { toast }  = useToast();
  const navigate   = useNavigate();

  useEffect(() => {
    // Initial fetch of scheduled messages.
    const load = async () => {
      try {
        const scheduled = await messageApi.getAllScheduledMessages();
        setScheduledMessages(scheduled);
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
      await messageApi.deleteScheduledMessage(id);
      setScheduledMessages(prev => prev.filter(m => m.id !== id));
      toast({ title: t('toasts.deletedTitle'), description: t('toasts.scheduledDeletedDesc') });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : t('toasts.failedDelete');
      toast({ title: t('common.error'), description: message, variant: 'destructive' });
    }
  };

  const handleSave = async (message: ScheduledMessage) => {
    // Create or update based on whether we're editing an existing message.
    try {
      if (editingMessage) {
        const updated = await messageApi.updateScheduledMessage(message.id, message);
        setScheduledMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
        toast({ title: t('toasts.updatedTitle'), description: t('toasts.updatedDesc') });
      } else {
        const created = await messageApi.createScheduledMessage(message);
        setScheduledMessages(prev => [...prev, created]);
        toast({ title: t('toasts.createdTitle'), description: t('toasts.scheduledCreatedDesc') });
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1" />
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-auto py-2 px-4 whitespace-normal" onClick={() => navigate('/admin/messaging/history')}>
            {t('scheduledSection.viewHistory')}
          </Button>
          <Button className="h-auto py-2 px-4 whitespace-normal" onClick={() => { setEditingMessage(null); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4 shrink-0" /> {t('scheduledSection.newMessage')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t('common.loadingMessages')}</div>
      ) : scheduledMessages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t('scheduledSection.empty')}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scheduledMessages.map((message) => (
            <ScheduledMessageCard
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
          mode="scheduled"
          onClose={() => setIsDialogOpen(false)}
          initialData={editingMessage}
          onSave={handleSave as any}
          enumOptions={enumOptions}
        />
      )}
    </div>
  );
};
