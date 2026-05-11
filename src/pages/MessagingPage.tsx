import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageHistoryPage } from '@/pages/messageHistoryPage';
import { ScheduledMessageSection } from '@/components/messaging/ScheduledMessageSection';
import { TriggeredMessageSection } from '@/components/messaging/TriggeredMessageSection';

export const MessagingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHistory = location.pathname.includes('/admin/messaging/history');
  const activeTab = location.pathname.includes('/admin/messaging/triggered') ? 'triggered' : 'scheduled';

  useEffect(() => {
    if (location.pathname === '/admin/messaging' || location.pathname === '/admin/messaging/') {
      navigate('/admin/messaging/scheduled', { replace: true });
    }
  }, [location.pathname, navigate]);

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
        {!isHistory && (
          <>
            <TabsContent value="scheduled" className="mt-6">
              <ScheduledMessageSection />
            </TabsContent>
            <TabsContent value="triggered" className="mt-6">
              <TriggeredMessageSection />
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
