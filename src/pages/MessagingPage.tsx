import '@/index.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageHistoryPage } from '@/pages/messageHistoryPage';
import { ScheduledMessageSection } from '@/components/messaging/ScheduledMessageSection';
import { TriggeredMessageSection } from '@/components/messaging/TriggeredMessageSection';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { MessagingEnumResponse } from '@/types/messaging';
import * as messageApi from '@/services/messageService';

export const MessagingPage = () => {
  const { t } = useTranslation('messaging');
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
          : t('toasts.failedLoadOptions');
        toast({ title: t('common.error'), description: message, variant: 'destructive' });
      });
  }, [toast, t]);

  return (
    <div className="space-y-6 p-6 pb-24 px-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => navigate(`/admin/messaging/${val}`)} className="w-full">
        <TabsList className="inline-flex h-auto p-1 gap-1 max-w-full flex-wrap sm:flex-nowrap bg-muted rounded-lg">
          <TabsTrigger value="scheduled" className="h-auto py-2 px-4 whitespace-normal text-center leading-snug data-[state=active]:bg-[#161E54] data-[state=active]:text-white transition-all">{t('tabs.scheduled')}</TabsTrigger>
          <TabsTrigger value="triggered" className="h-auto py-2 px-4 whitespace-normal text-center leading-snug data-[state=active]:bg-[#161E54] data-[state=active]:text-white transition-all">{t('tabs.triggered')}</TabsTrigger>
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

