import {config} from '../config.js';
import { NotificationManager } from "../modules/notificationManager.js";

jQuery(document).ready(function($){
    console.log('Presistant Notifications are Plugged in');
    const HEADER_NOTIFIER = new NotificationManager('top-notification' , 'top');
    const notiWindow = $('.noti-window');
    const notiOpener = $('[data-noti-opener]');

    notiOpener.on('click' , () => notiWindow.toggleClass('active'));



    HEADER_NOTIFIER.enableClearBtn();
});






fetch(`http://${config.baseUrl}:3001/api/notifications?type=normal` , {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    console.log(`Notifications: ` , data);
    if(!data.success) throw new Error('Something went wrong on our side.');
    
})
.catch(e => {
    console.warn(e);
})



