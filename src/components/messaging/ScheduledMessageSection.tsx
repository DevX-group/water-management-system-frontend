import '@/index.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ScheduledMessage } from '@/types/messaging';
import * as messageApi from '@/services/messageService';
import { ScheduledMessageCard } from '@/components/messaging/ScheduledMessageCard';
import { MessageDialog } from '@/components/messaging/MessageDialog';

export const ScheduledMessageSection = () => {
  // Server-backed list of scheduled messages.
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading]                 = useState(true);
  const [isDialogOpen, setIsDialogOpen]           = useState(false);
  const [editingMessage, setEditingMessage]       = useState<ScheduledMessage | null>(null);
  const [placeholders, setPlaceholders]           = useState<string[]>([]);
  const { toast }  = useToast();
  const navigate   = useNavigate();

  useEffect(() => {
    // Initial fetch of scheduled messages.
    const load = async () => {
      try {
        const scheduled = await messageApi.getAllScheduledMessages();
        setScheduledMessages(scheduled);
      } catch {
        toast({ title: 'Error', description: 'Failed to load messages.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [toast]);

  useEffect(() => {
    // Placeholder tokens used by the template editor.
    messageApi.getMessagePlaceholders()
      .then(setPlaceholders)
      .catch(() => toast({ title: 'Error', description: 'Failed to load placeholders.', variant: 'destructive' }));
  }, [toast]);

  const handleDelete = async (id: string) => {
    // Delete and prune the list locally on success.
    try {
      await messageApi.deleteScheduledMessage(id);
      setScheduledMessages(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Message deleted', description: 'The scheduled message has been successfully deleted.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete message.', variant: 'destructive' });
    }
  };

  const handleSave = async (message: ScheduledMessage) => {
    // Create or update based on whether we're editing an existing message.
    try {
      if (editingMessage) {
        const updated = await messageApi.updateScheduledMessage(message.id, message);
        setScheduledMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
        toast({ title: 'Message updated', description: 'Your changes have been saved.' });
      } else {
        const created = await messageApi.createScheduledMessage(message);
        setScheduledMessages(prev => [...prev, created]);
        toast({ title: 'Message created', description: 'New scheduled message has been created.' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save message.', variant: 'destructive' });
    }
    setIsDialogOpen(false);
    setEditingMessage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center gap-5">
          <Button variant="outline" onClick={() => navigate('/admin/messaging/history')}>
            View Scheduled Message History
          </Button>
          <Button onClick={() => { setEditingMessage(null); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New Scheduled Message
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading messages...</div>
      ) : scheduledMessages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No scheduled messages yet.</div>
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
          placeholders={placeholders}
        />
      )}
    </div>
  );
};
