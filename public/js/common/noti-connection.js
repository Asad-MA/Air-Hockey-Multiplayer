import {NotificationManager} from "../modules/notificationManager.js";

    console.log('Notification Service is plugged-IN');
    let socket;
    const notifier = new NotificationManager();
const userId = prompt("Enter your user ID:");

function connectToNotificationServer(userId) {
  socket = new WebSocket('ws://localhost:3005');

  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'register', userId }));
    console.log(`Connected as ${userId}`);
  });

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log("📥 Notification received:", data);

    // Display in-app notification
    notifier.push(data.type , data.message , { type: 'success', duration: 0 })
  });

  socket.addEventListener('close', () => {
    console.warn('Disconnected from notification server');
  });
}

connectToNotificationServer(userId);

