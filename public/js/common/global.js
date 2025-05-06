import { config } from '../config.js';


jQuery(document).ready(function($){
    console.log("Global Loaded!");
    const OVERLAY = $('.overlay');

    OVERLAY.on('click' , function(){
        console.log('.');
        $(this).siblings('.active').removeClass('active');
    });
});



export function acceptCallback(notification){
    console.log('Request Accepted' , notification);
    fetch(`http://${config.baseUrl}:3001/social/friend/accept-request`, {
        method: 'POST',
        body: JSON.stringify(notification),
        headers: {
            'Content-Type': 'application/json'
          },
    })
    .then(response => response.json())
    .then(data => console.log('Request Accepted!'))
    .catch(e => console.error(e.message))
}

export function rejectCallback(notification){
    console.log('Request Rejected' , notification);
}
