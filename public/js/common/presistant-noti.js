import { NotificationManager } from "../modules/notificationManager.js";

console.log('Presistant Notifications are Plugged in');

const HEADER_NOTIFIER = new NotificationManager('top-notification' , 'top');
HEADER_NOTIFIER.enableClearBtn();

HEADER_NOTIFIER.push('New Friend Request!', 'System will restart in 10 minutes', { type: 'user', duration: 0 });
HEADER_NOTIFIER.push('Persistent Notice!', 'System will restart in 10 minutes', { type: 'user', duration: 0, actions: [
    { label: 'Accept', callback: () => console.log('Accepted') },
    { label: 'Reject', callback: () => console.log('Rejected') }
]});
HEADER_NOTIFIER.push('Persistent Notice!', 'System will restart in 10 minutes', { type: 'user', duration: 0 });
HEADER_NOTIFIER.push('Action Required!', 'Please enable 2F Authentication to secure your account.', { type: 'user', duration: 0, actions: [
    { label: 'Enable', callback: () => console.log('Accepted') },
    { label: 'Not Now', callback: () => console.log('Rejected') }
]});

HEADER_NOTIFIER.push('Persistent Notice!', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel egestas dolor, nec dignissim metus.', { type: 'user', duration: 0 });