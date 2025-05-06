import { NotificationManager } from "../modules/notificationManager.js";
import { acceptCallback , rejectCallback } from "./global.js";

console.log('Notification Service is plugged-IN');
let socket;
const notifier = new NotificationManager();

function connectToNotificationServer() {
  socket = new WebSocket('ws://localhost:3005');

  socket.addEventListener('open', () => {
    // socket.send(JSON.stringify({ type: 'register', userId }));
    // console.log(`Connected as ${userId}`);
  });

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log("📥 Notification received:", data);
    var actions = [];
    if (data.type == 'friend_request')
      actions = [
        { label: '<i class="fa-solid fa-check"></i> Accept', callback: () => acceptCallback(data) },
        { label: '<i class="fa-solid fa-xmark"></i> Reject', callback: () => rejectCallback(data) }
      ]
    // Display in-app notification
    notifier.push(data.title, data.message, {
      type: 'user',
      duration: 0,
      actions
    })
  });

  socket.addEventListener('close', () => {
    console.warn('Disconnected from notification server');
  });
}

connectToNotificationServer();

