import { api } from "./api";
import { NotificationResponse } from "@/types/customerNotification";

export const getCustomerNotifications = async (): Promise<NotificationResponse[]> => {
  const response = await api.get<NotificationResponse[]>("/customer/notifications");
  return response.data;
};

export const getUnreadCustomerNotifications = async (): Promise<NotificationResponse[]> => {
  const response = await api.get<NotificationResponse[]>("/customer/notifications/unread");
  return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await api.put(`/customer/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.put("/customer/notifications/read-all");
};
