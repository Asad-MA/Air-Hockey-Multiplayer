import { config } from '../config.js';
import { NotificationManager } from "../modules/notificationManager.js";
import { acceptCallback , rejectCallback } from "./global.js";

jQuery(document).ready(function ($) {
    console.log('Presistant Notifications are Plugged in');
    const HEADER_NOTIFIER = new NotificationManager('top-notification', 'top');
    const notiWindow = $('.noti-window');
    const notiOpener = $('[data-noti-opener]');

    notiOpener.on('click', () => notiWindow.toggleClass('active'));

    fetch(`http://${config.baseUrl}:3001/api/notifications`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            console.log(`Notifications: `, data);
            if (!data.success) throw new Error('Something went wrong on our side.');
            data.data.forEach(notification => {
                var actions = [];
                if (notification.type == 'friend_request')
                    actions = [
                        { label: '<i class="fa-solid fa-check"></i> Accept', callback: () => acceptCallback(notification) },
                        { label: '<i class="fa-solid fa-xmark"></i> Reject', callback: () => rejectCallback(notification) }
                    ]
                HEADER_NOTIFIER.push(notification.title, notification.message, { type: notification.type, duration: 0, actions })
            });

        })
        .catch(e => {
            console.warn(e);
        })


    HEADER_NOTIFIER.enableClearBtn();


    

});










