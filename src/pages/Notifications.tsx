import '@/index.css';
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationsStats, NotificationsFilter } from "@/components/notifications/NotificationsStats";
import { NotificationList } from "@/components/notifications/NotificationList";

import { useNotifications } from "@/hooks/useNotifications";

const Notifications = () => {
  const {
    filter,
    loading,
    currentIndex,
    itemsPerPage,
    setFilter,
    setCurrentIndex,
    handleDismiss,
    counts,
    filteredAlerts
  } = useNotifications();

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">
            Anomaly <span className="text-gradient">Alerts</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Real-time monitoring and detection of unusual water consumption patterns.
          </p>
        </div>

        <div className="space-y-10">
          <NotificationsStats counts={counts} />
          <NotificationsFilter filter={filter} setFilter={setFilter} />
          <NotificationList
            alerts={filteredAlerts}
            loading={loading}
            currentIndex={currentIndex}
            itemsPerPage={itemsPerPage}
            setCurrentIndex={setCurrentIndex}
            onDismiss={handleDismiss}
          />
        </div>
      </div>
    </MainLayout>

  );
};

export default Notifications;