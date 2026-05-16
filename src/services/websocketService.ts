//import { Client } from "@stomp/stompjs";
//import SockJS from "sockjs-client";

let stompClient: Client | null = null;

export const connectAdminSlipSocket = (
  onMessage: (data: any) => void
) => {
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