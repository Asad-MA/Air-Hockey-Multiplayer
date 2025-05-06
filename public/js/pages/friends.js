import { config } from '../config.js';

console.log('Friends Plugged in');
jQuery(document).ready(function($){

     fetch(`http://${config.baseUrl}:3001/social/friends/get`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
               
                console.log(data);
            })
            .catch(e => {
                console.warn(e);
            })


});