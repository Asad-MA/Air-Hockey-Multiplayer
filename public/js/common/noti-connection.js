import { NotificationManager } from "../modules/notificationManager.js";
import { acceptCallback , rejectCallback , acceptChallenge, rejectChallenge } from "./global.js";

console.log('Notification Service is plugged-IN');
let socket;
const notifier = new NotificationManager();

function connectToNotificationServer() {
  socket = new WebSocket(`ws://${config.baseUrl}:3005/notifications`, []);

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log("📥 Notification received:", data);
    var actions = [];
    if (data.type == 'friend')
      actions = [
        { label: '<i class="fa-solid fa-check"></i> Accept', callback: () => acceptCallback(data) },
        { label: '<i class="fa-solid fa-xmark"></i> Reject', callback: () => rejectCallback(data) }
      ]

      if (data.type == 'challenge')
        actions = [
          { label: '<i class="fa-solid fa-check"></i> Accept', callback: () => acceptChallenge(data) },
          { label: '<i class="fa-solid fa-xmark"></i> Reject', callback: () => rejectChallenge(data) }
        ]
    // Display in-app notification
    notifier.push(data.title, data.message,data.createdAt, {
      type: 'user',
      duration: 0,
      actions
    })
  });

  socket.addEventListener('close', () => {
    console.warn('Error while connecting to the notification server');
    notifier.push('Notification Connection Closed!' , `You've been disconnected from the notification server. Click below to reconnect.`,new Date(), {
      type: 'system',
      duration: 0,
      actions: [
        {label: 'Reconnect' , callback: ()=> {connectToNotificationServer()}},
        {label: 'Ignore' , callback: ()=>{}}
      ]
    })
  });
}

connectToNotificationServer();



