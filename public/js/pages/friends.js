import { config } from '../config.js';

console.log('Friends Plugged in');
jQuery(document).ready(function($){
    const friendsList = $('[data-friends-list]');
    const count = $('#friend-count');

     fetch(`http://${config.baseUrl}:3001/social/friends/get`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
               
                console.log(data);
                count.text(data.friends.length)
                data.friends.forEach((friend , i) => {
                    friendsList.append(`
                        <div class="ui-table-row grad-dark1 d-flex align-center gap-10">
                                <span class="ui-table-col text-sm">#${i + 1}</span>
                                <span class="ui-table-col d-flex align-center gap-10 w-full-available">
                                    <span class="user-avatar-lg box-img box-rounded bg-gray">
                                        <a href="social/profile/${friend.name}">
                                            <img src="${friend.avatar}">
                                        </a>
                                    </span>
                                    <span class="user-detail-sm w-full-available">
                                        <a href="social/profile/${friend.name}"><h5 class="text-sm user-displayname my-0">${friend.displayName}</h5></a>
                                        <div class="d-flex justify-between">
                                           <a href="social/profile/${friend.name}"> <span class="user-name text-sm text-gray">@${friend.name}</span></a>
                                            

                                        </div>

                                    </span>
                                    <span class="d-flex align-center gap-20 text-gray">
                                        <i data-open-chat="${friend.email}" class="fa-solid fa-envelope-open"></i>
                                        <i data-remove-friend="${friend.email}" class="fa-solid fa-user-minus"></i>
                                        <i data-send-challenge="${friend.email}" class="fa-solid fa-trophy"></i>
                                    </span>
                                </span>

                            </div>
                        `);
                })
            })
            .catch(e => {
                console.warn(e);
            })


});