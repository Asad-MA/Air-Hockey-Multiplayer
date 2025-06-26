jQuery(document).ready(function() {

function connectToRTGS() {
    const socket = new WebSocket(`ws://${config.baseUrl}:3005/status`, []);

    socket.onopen = function() {
        console.log("Connected to RTGS [status traking]");
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log("📥 Status update received:", data);
        switch (data.type) {
            case 'friendOnline':
            case 'initialOnlineFriends':
                renderActiveFriends(data.onlineFriends);
                break;
            case 'friendOffline':
                removeActiveFriend(data.offlineFriends);
                break;
                // Handle individual friend status updates if needed
                console.log(`Friend ${data.email} is now ${data.status}`);
                break;
            default:
                console.warn("Unknown message type:", data.type);
        }
    };

    socket.onclose = function() {
        console.log("Disconnected from RTGS [status traking] WebSocket");
    };

    socket.onerror = function(error) {
        console.error("WebSocket error:", error);
    };
}

function renderActiveFriends(activeFriends) {
    console.log("Rendering active friends:", activeFriends);
    const activeFriendsList = $("#active-friends-table");
    // activeFriendsList.empty(); // Clear previous list
    $('[data-row="empty"]').hide();
    activeFriends.forEach(friend => {
        activeFriendsList.append(`
             <div class="ui-table-row d-flex align-center gap-10" data-active-friend="${friend.email}">
                                <span class="ui-table-col text-sm">1</span>
                                <span class="ui-table-col d-flex gap-10 w-full-available">
                                    <span class="user-avatar-sm box-img box-rounded w-50 h-50 bg-gray">
                                        <img src="${friend.avatar}" alt="${friend.displayName}" class="w-100 h-100 box-rounded">
                                    </span>
                                    <span class="user-detail-sm w-full-available">
                                        <h5 class="text-sm user-displayname my-0">${friend.displayName}</h5>
                                        <div class="d-flex justify-between">
                                            <span class="user-name text-sm text-gray">@username</span>
                                            <span class="d-flex align-center gap-20 text-gray">
                                        <i data-open-chat="${friend.email}" class="fa-solid fa-envelope-open"></i>
                                        <i data-remove-friend="${friend.email}" class="fa-solid fa-user-minus"></i>
                                        <i data-send-challenge="${friend.email}" class="fa-solid fa-trophy"></i>
                                    </span>
                                        </div>

                                    </span>
                                </span>

                            </div>
            `);
    });
}

function removeActiveFriend(offlineFriends){
    console.log(offlineFriends)
    const activeFriendsList = $("#active-friends-table");

    offlineFriends.forEach(friend => {
        $(`[data-active-friend="${friend.email}"]`).remove();
        console.log(`Removed ${friend.email} from active friends list`);
    });

    if($('[data-active-friend]').length === 0) {
        $('[data-row="empty"]').show();
    }
}

connectToRTGS();

});