export type NotificationType = "MANUAL_PAYMENT" | "BANK_SLIP_APPROVED" | "BANK_SLIP_REJECTED" | "MONTHLY_BILL";

export interface NotificationRequest {
    subscriptionNumber: string;
    notificationType: NotificationType;
    title: string;
    message: string;

}

export interface NotificationResponse {
    id: number;
    subscriptionNumber: string;
    notificationType: NotificationType;
    title: string;
    message: string;
    readStatus: boolean;
    createdAt: string;
}