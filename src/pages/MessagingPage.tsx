import '@/index.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageHistoryPage } from '@/pages/messageHistoryPage';
import { ScheduledMessageSection } from '@/components/messaging/ScheduledMessageSection';
import { TriggeredMessageSection } from '@/components/messaging/TriggeredMessageSection';
import { useToast } from '@/hooks/use-toast';
import type { MessagingEnumResponse } from '@/types/messaging';
import * as messageApi from '@/services/messageService';

export const MessagingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enumOptions, setEnumOptions] = useState<MessagingEnumResponse | null>(null);
  // Switch between list tabs and history view based on the URL.
  const isHistory = location.pathname.includes('/admin/messaging/history');
  const activeTab = location.pathname.includes('/admin/messaging/triggered') ? 'triggered' : 'scheduled';

  useEffect(() => {
    // Keep the messaging root path pinned to the scheduled tab.
    if (location.pathname === '/admin/messaging' || location.pathname === '/admin/messaging/') {
      navigate('/admin/messaging/scheduled', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    // Enum values (channels, schedule types, recipients, placeholders) shared by dialogs.
    messageApi.getMessagingEnums()
      .then(setEnumOptions)
      .catch((error) => {
        const message = error instanceof Error
          ? error.message
          : 'Failed to load message options.';
        toast({ title: 'Error', description: message, variant: 'destructive' });
      });
  }, [toast]);

  return (
    <div className="space-y-6 p-6 pb-24 px-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messaging</h1>
          <p className="text-muted-foreground">Manage automated and custom messages for customers.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => navigate(`/admin/messaging/${val}`)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-[#161E54] data-[state=active]:text-white">Scheduled Messages</TabsTrigger>
          <TabsTrigger value="triggered" className="data-[state=active]:bg-[#161E54] data-[state=active]:text-white">Triggered Messages</TabsTrigger>
        </TabsList>
        {/* Only render the list tabs when not showing history. */}
        {!isHistory && (
          <>
            <TabsContent value="scheduled" className="mt-6">
              <ScheduledMessageSection enumOptions={enumOptions} />
            </TabsContent>
            <TabsContent value="triggered" className="mt-6">
              <TriggeredMessageSection enumOptions={enumOptions} />
            </TabsContent>
          </>
        )}
      </Tabs>
      {isHistory && (
        <div className="mt-6">
          <MessageHistoryPage />
        </div>
      )}
    </div>
  );
};

export default MessagingPage;
