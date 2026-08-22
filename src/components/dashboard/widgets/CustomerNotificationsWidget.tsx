import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { getCustomerNotifications, markNotificationAsRead } from '@/services/notificationService';
import type { NotificationResponse } from '@/types/customerNotification';

export const CustomerNotificationsWidget: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerNotifications()
      .then((data) => setNotifications(data.slice(0, 5)))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRead = async (id: number) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  if (loading) {
    return <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse h-8 bg-muted rounded" />
      ))}
    </div>;
  }

  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center gap-1 text-muted-foreground py-4">
        <CheckCircle className="w-5 h-5 text-success" />
        <span className="text-xs">No new notifications</span>
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {notifications.map((n) => (
        <li
          key={n.id}
          className={`flex items-start gap-2 text-xs p-2 rounded-lg cursor-pointer transition-colors ${
            n.read ? 'opacity-60' : 'bg-primary/5 hover:bg-primary/10'
          }`}
          onClick={() => !n.read && handleRead(n.id)}
        >
          <Bell className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
          <span className="text-foreground">{n.message}</span>
        </li>
      ))}
    </ul>
  );
};
