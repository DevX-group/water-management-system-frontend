import '@/index.css';
import React from "react";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationsStats, NotificationsFilter } from "@/components/notifications/NotificationsStats";
import { NotificationList } from "@/components/notifications/NotificationList";

import { useNotifications } from "@/hooks/useNotifications";

const Notifications = () => {
  const { t } = useTranslation('alerts');
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
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('anomaly')} {t('alerts')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t('subtitle')}
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

