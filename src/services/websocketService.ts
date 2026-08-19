import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
let customerStompClient: Client | null = null;

export const connectAdminSlipSocket = (
  onMessage: (data: any) => void
) => {
  // Use SockJS + STOMP to receive real-time slip updates.
  stompClient = new Client({
    webSocketFactory: () => new SockJS("https://water-management-system-backend-0p2e.onrender.com/ws"), 
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    console.log("WebSocket connected");

    stompClient?.subscribe("/topic/admin/bank-slips", (message) => {
      const body = JSON.parse(message.body);
      onMessage(body);
    });
  };

  stompClient.activate();
};

export const disconnectAdminSlipSocket = () => {
  stompClient?.deactivate();
};

export const connectCustomerNotificationSocket = (
  onMessage: (data: any) => void,
  subscriptionNumber?: string
) => {
  if (customerStompClient && customerStompClient.active) {
    return customerStompClient;
  }

  customerStompClient = new Client({
    webSocketFactory: () => new SockJS("https://water-management-system-backend-0p2e.onrender.com/ws"),
    reconnectDelay: 5000,
  });

  customerStompClient.onConnect = () => {
    console.log("Customer WebSocket connected");

    // Subscriptions for real-time customer notifications
    customerStompClient?.subscribe("/topic/customer/notifications", (message) => {
      try {
        const body = JSON.parse(message.body);
        onMessage(body);
      } catch (err) {
        console.error("Failed to parse websocket message:", err);
      }
    });

    customerStompClient?.subscribe("/user/queue/notifications", (message) => {
      try {
        const body = JSON.parse(message.body);
        onMessage(body);
      } catch (err) {
        console.error("Failed to parse websocket message:", err);
      }
    });

    if (subscriptionNumber) {
      customerStompClient?.subscribe(`/topic/customer/${subscriptionNumber}/notifications`, (message) => {
        try {
          const body = JSON.parse(message.body);
          onMessage(body);
        } catch (err) {
          console.error("Failed to parse websocket message:", err);
        }
      });
    }
  };

  customerStompClient.activate();
  return customerStompClient;
};

export const disconnectCustomerNotificationSocket = () => {
  if (customerStompClient) {
    customerStompClient.deactivate();
    customerStompClient = null;
  }
};