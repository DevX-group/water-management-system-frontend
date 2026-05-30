import '@/index.css';
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { TriggeredMessage } from '@/types/messaging';
import * as messageApi from '@/services/messageService';
import { TriggeredMessageCard } from '@/components/messaging/TriggeredMessageCard';
import { MessageDialog } from '@/components/messaging/MessageDialog';

export const TriggeredMessageSection = () => {
  // Server-backed list of triggered message templates.
  const [triggeredMessages, setTriggeredMessages] = useState<TriggeredMessage[]>([]);
  const [isLoading, setIsLoading]                 = useState(true);
  const [isDialogOpen, setIsDialogOpen]           = useState(false);
  const [editingMessage, setEditingMessage]       = useState<TriggeredMessage | null>(null);
  const [placeholders, setPlaceholders]           = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch of triggered templates.
    const load = async () => {
      try {
        const triggered = await messageApi.getAllTriggeredMessages();
        setTriggeredMessages(triggered);
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
      await messageApi.deleteTriggeredMessage(id);
      setTriggeredMessages(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Message deleted', description: 'The triggered message has been successfully deleted.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete message.', variant: 'destructive' });
    }
  };

  const handleSave = async (message: TriggeredMessage) => {
    // Create or update based on whether we're editing an existing message.
    try {
      if (editingMessage) {
        const updated = await messageApi.updateTriggeredMessage(message.id, message);
        setTriggeredMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
        toast({ title: 'Message updated', description: 'Your changes have been saved.' });
      } else {
        const created = await messageApi.createTriggeredMessage(message);
        setTriggeredMessages(prev => [...prev, created]);
        toast({ title: 'Message created', description: 'New triggered message has been created.' });
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
        <Button onClick={() => { setEditingMessage(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Triggered Message
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading messages...</div>
      ) : triggeredMessages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No triggered messages yet.</div>
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
          placeholders={placeholders}
        />
      )}
    </div>
  );
};
