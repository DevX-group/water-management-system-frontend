import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ShieldCheck,
  XCircle,
  Receipt,
  Inbox,
  Loader2,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NotificationResponse, NotificationType } from "@/types/customerNotification";
import {
  getCustomerNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notificationService";
import {
  connectCustomerNotificationSocket,
  disconnectCustomerNotificationSocket,
} from "@/services/websocketService";
import { CustomerNotificationModal } from "./CustomerNotificationModal";

const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0 || diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case "MANUAL_PAYMENT":
      return {
        icon: CheckCircle2,
        color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
      };
    case "BANK_SLIP_APPROVED":
      return {
        icon: ShieldCheck,
        color: "text-teal-500 bg-teal-50 dark:bg-teal-950/40",
      };
    case "BANK_SLIP_REJECTED":
      return {
        icon: XCircle,
        color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40",
      };
    case "MONTHLY_BILL":
      return {
        icon: Receipt,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
      };
    default:
      return {
        icon: Bell,
        color: "text-slate-500 bg-slate-50 dark:bg-slate-800",
      };
  }
};

export const CustomerNotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCustomerNotifications();
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleWebsocketMessage = (newNotif: NotificationResponse) => {
      if (!newNotif || !newNotif.id) return;

      setNotifications((prev) => {
        const exists = prev.some((item) => item.id === newNotif.id);
        if (exists) {
          return prev.map((item) => (item.id === newNotif.id ? newNotif : item));
        }
        return [newNotif, ...prev];
      });
    };

    connectCustomerNotificationSocket(handleWebsocketMessage);

    return () => {
      disconnectCustomerNotificationSocket();
    };
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.readStatus);
  const unreadCount = unreadNotifications.length;

  const handleMarkAsRead = async (id: number, currentStatus?: boolean) => {
    if (currentStatus) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n))
    );

    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readStatus: false } : n))
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      fetchNotifications();
    }
  };

  const handleOpenModal = () => {
    setDropdownOpen(false);
    setModalOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl w-9 h-9"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-80 sm:w-96 rounded-xl p-0 shadow-lg border border-border bg-background overflow-hidden z-50"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">New Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List Content - Shows ONLY NEW / UNREAD notifications */}
          <div className="max-h-[300px] overflow-y-auto divide-y divide-border/40">
            {loading ? (
              <div className="py-8 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Loading...
              </div>
            ) : unreadNotifications.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                <Inbox className="w-6 h-6 text-muted-foreground/60" />
                <p className="text-xs text-muted-foreground">No new notifications</p>
              </div>
            ) : (
              unreadNotifications.map((notification) => {
                const { icon: IconComponent, color } = getTypeIcon(notification.notificationType);

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-3 transition-colors cursor-pointer flex gap-3 items-start bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40"
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer: See All option -> Opens Modal Popup */}
          <div className="p-2 border-t border-border bg-muted/20 text-center">
            <button
              onClick={handleOpenModal}
              className="text-xs text-primary font-medium hover:underline inline-flex items-center justify-center gap-1 py-1 w-full"
            >
              See all notifications
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal Popup Window */}
      <CustomerNotificationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        notifications={notifications}
        loading={loading}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
};
