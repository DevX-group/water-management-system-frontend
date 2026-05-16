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
      <div className="min-h-screen bg-[#FFFDF5]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-slate-800">Anomaly Alerts</h1>
          </div>
          <NotificationsStats counts={counts} />
          <NotificationsFilter filter={filter} setFilter={setFilter} />
          <NotificationList
            alerts={filteredAlerts} loading={loading}
            currentIndex={currentIndex} itemsPerPage={itemsPerPage}
            setCurrentIndex={setCurrentIndex} onDismiss={handleDismiss}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;