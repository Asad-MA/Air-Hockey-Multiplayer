import { NotificationManager } from "../modules/notificationManager.js";

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

    // Display in-app notification
    notifier.push(data.title, data.message, {
      type: 'user',
      duration: 0,
      actions: [
        { label: 'Accept', callback: () => console.log('Accepted') },
        { label: 'Reject', callback: () => console.log('Rejected') }
      ]
    })
  });

  socket.addEventListener('close', () => {
    console.warn('Disconnected from notification server');
  });
}

connectToNotificationServer();

