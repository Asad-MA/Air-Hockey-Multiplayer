import { config } from '../config.js';


jQuery(document).ready(function($){
    console.log("Global Loaded!");
    const OVERLAY = $('.overlay');

    OVERLAY.on('click' , function(){
        console.log('.');
        $(this).siblings('.active-flex').removeClass('active-flex');
        $(this).siblings('.active').removeClass('active');
    });

    $(document).on('click' , '[data-send-challenge]' , function(){
        const $to = $(this).attr('data-send-challenge');
        console.log('Sending Challenge to ' ,$to);

        fetch(`http://${config.baseUrl}:3001/social/challenge/send`, {
            method: 'POST',
            body: JSON.stringify({
               to: $to 
            }),
            headers: {
                'Content-Type': 'application/json'
              },
        })
        .then(response => response.json())
        .then(data => console.log('Challenge Send!' , data))
        .catch(e => console.error(e.message))
    })
    

    // Send Challenge


    // Accept Challenge
});


export function acceptChallenge(notification){
    console.log('Request Accepted' , notification);
    fetch(`http://${config.baseUrl}:3001/social/challenge/accept`, {
        method: 'POST',
        body: JSON.stringify(notification),
        headers: {
            'Content-Type': 'application/json'
          },
    })
    .then(response => response.json())
    .then(data => console.log('Challenge Accepted!'))
    .catch(e => console.error(e.message))
}

export function rejectChallenge(notification){
    console.log('Request Rejected' , notification);
    fetch(`http://${config.baseUrl}:3001/social/challenge/reject`, {
        method: 'POST',
        body: JSON.stringify(notification),
        headers: {
            'Content-Type': 'application/json'
          },
    })
    .then(response => response.json())
    .then(data => console.log('Request Rejected!'))
    .catch(e => console.error(e.message))
}




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
    fetch(`http://${config.baseUrl}:3001/social/friend/reject-request`, {
        method: 'POST',
        body: JSON.stringify(notification),
        headers: {
            'Content-Type': 'application/json'
          },
    })
    .then(response => response.json())
    .then(data => console.log('Request Rejected!'))
    .catch(e => console.error(e.message))
}
