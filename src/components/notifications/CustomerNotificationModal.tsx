import React, { useState } from "react";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ShieldCheck,
  XCircle,
  Receipt,
  Inbox,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationResponse, NotificationType } from "@/types/customerNotification";
import { useTranslation } from "react-i18next";
import { translateNotificationTitle, translateNotificationMessage } from "@/utils/notificationTranslationUtils";

interface CustomerNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: NotificationResponse[];
  loading: boolean;
  onMarkAsRead: (id: number, currentStatus: boolean) => void;
  onMarkAllAsRead: () => void;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTypeConfig = (type: NotificationType) => {
  switch (type) {
    case "MANUAL_PAYMENT":     return { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" };
    case "BANK_SLIP_APPROVED": return { icon: ShieldCheck,  color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400" };
    case "BANK_SLIP_REJECTED": return { icon: XCircle,      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400" };
    case "MONTHLY_BILL":       return { icon: Receipt,      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400" };
    default:                   return { icon: Bell,         color: "text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-300" };
  }
};

export const CustomerNotificationModal: React.FC<CustomerNotificationModalProps> = ({
  open,
  onOpenChange,
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const { t } = useTranslation('alerts');
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const getTypeLabel = (type: NotificationType): string => {
    const key = `notification.types.${type}` as const;
    const translated = t(key);
    return translated !== key ? translated : t('notification.types.DEFAULT');
  };

  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.readStatus;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full h-[80vh] max-h-[680px] rounded-2xl p-0 gap-0 overflow-hidden border border-border shadow-2xl bg-background z-50 flex flex-col">
        {/* Modal Header */}
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0 bg-muted/20 pr-12 shrink-0">
          <div className="flex items-center gap-2.5">
            <DialogTitle className="text-base font-bold text-foreground">
              {t('notification.historyTitle')}
            </DialogTitle>
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} {t('notification.unread')}
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={onMarkAllAsRead}
              variant="ghost"
              size="sm"
              className="text-xs text-primary hover:text-primary/80 gap-1.5 h-8 px-2.5 rounded-xl font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {t('notification.markAllRead')}
            </Button>
          )}
        </DialogHeader>

        {/* Filter Bar */}
        <div className="px-4 py-2.5 bg-muted/10 border-b border-border/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t('notification.all')} ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === "unread"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t('notification.unreadFilter')} ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notification List Container (Expanded Vertical Space) */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/40 p-3">
          {loading ? (
            <div className="py-20 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              {t('notification.loadingNotifications')}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <Inbox className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-xs font-medium text-muted-foreground">
                {filter === "unread" ? t('notification.noUnread') : t('notification.noFound')}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const { icon: IconComponent, color } = getTypeConfig(notification.notificationType);
              const label = getTypeLabel(notification.notificationType);

              return (
                <div
                  key={notification.id}
                  onClick={() => onMarkAsRead(notification.id, notification.readStatus)}
                  className={`p-3.5 rounded-xl transition-colors cursor-pointer flex gap-3.5 items-start ${!notification.readStatus
                      ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40"
                      : "hover:bg-muted/40"
                    }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {translateNotificationTitle(notification.notificationType, notification.title, t)}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-muted text-muted-foreground shrink-0">
                          {label}
                        </span>
                      </div>

                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {translateNotificationMessage(notification.notificationType, notification.message, t)}
                    </p>
                  </div>

                  {!notification.readStatus && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
