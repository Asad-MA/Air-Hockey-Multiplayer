jQuery(document).ready(function ($) {
    const chatList = $('.added-users');
    const chatHead = $('[data-chathead]');
    const sendBtn = $('[data-send-chat]');
    const messageTyper = $('#message-typer');
    const chatWindow = $('.chat-window');



    $(document).on('click', '[data-open-chat]', function () {
        const userData = { id: $(this).attr('data-open-chat'), displayName: $(this).attr('data-username'), avatar: $(this).attr('data-avatar') }
        createChatItem(userData)
    })

    $(document).on('click', '.chat-item', function () {
        const chatData = { avatar: $(this).attr('data-avatar'), id: $(this).attr('data-chat-id'), username: $(this).attr('data-username'), userid: $(this).attr('data-uid') }
        loadChat(chatData);
    });


    sendBtn.on('click', function () {
        const chatID = chatHead.attr('data-chatid');
        const chatUser = chatHead.attr('data-username');
        const chatUserID = chatHead.attr('data-uid');

        if (!chatUserID) {
            alert("Please select a user first to start chatting...");
            return;
        }

        if (!messageTyper.val().length) {
            alert('Oops! You forgot to type.')
            return;
        }

        const messageText = messageTyper.val().trim();

        $.ajax({
            url: '/social/chat/messages',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ chatID, message: messageText }),
            success: function (newMsg) {
                //appendMessage(newMsg);
                messageTyper.val('');
                newMsg.displayName = $('.user-meta > span').text() || 'Dummy';
                renderMessage(newMsg);

            },
            error: function () {
                alert('Failed to send message');
            }
        });

    });


    function createChatItem(chat) {
        chatList.append(`
            <div class="ui-table-row d-flex align-center gap-10 chat-item" data-avatar="${chat.avatar}" data-username="${chat.displayName}" data-chat-id="${chat.chatID}" data-uid="${chat.id}">
                                <span class="ui-table-col d-flex gap-10 w-full-available">
                                    <span class="user-avatar-sm box-img box-rounded w-50 h-50 bg-gray">
                                        <img src="${chat.avatar}" alt="Player Avatar" class="w-full h-full box-rounded">
                                    </span>
                                    <span class="user-detail-sm w-full-available">
                                        <h5 class="text-sm user-displayname my-0">${chat.displayName}</h5>
                                        <div class="d-flex justify-between">
                                            <span class="user-name text-sm text-gray">${chat.lastMessage || 'Last message text here...'}</span>
                                        </div>

                                    </span>
                                </span>

                            </div>    
        `)
    }

    async function loadUserChats(){
        $.ajax({
            url: '/social/chat/user',
            method: 'POST',
            contentType: 'application/json',
            success: function (chats) {
                console.log(chats)
                chatList.empty();
                chats.forEach(chat => {
                    createChatItem({chatID: chat.chatID , avatar: chat.friend.avatar , displayName: chat.friend.displayName , id: chat.friend._id, lastMessage: chat.lastMessage});
                })
            },
            error: function (e) {
                console.log(e)
                alert(`Failed to load user chats ${e}`);
            }
        });
    }


    async function loadChat(chatData) {
        chatHead.attr('data-chatid', chatData.id);
        chatHead.attr('data-username', chatData.username);
        chatHead.attr('data-uid', chatData.userid);
        $('[data-chatavatar]').html(`<span class="user-avatar-sm box-img box-rounded w-50 h-50 bg-gray">
                                        <img src="${chatData.avatar}" alt="Player Avatar" class="w-full h-full box-rounded">
                                    </span>`);
        $('[data-chatname]').text(chatData.username);


        await startChat(chatData.userid);
        await loadMessages(chatHead.attr('data-chatid'))

    }


    async function startChat(friendID) {
        const res = await fetch('/social/chat/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendID })
        });
        const chat = await res.json();
        chatHead.attr('data-chatid', chat._id);
    }

    async function loadMessages(chatID) {
        const res = await fetch(`/social/chat/messages/${chatID}`);
        const messages = await res.json();

        console.log(messages);
        chatWindow.empty();
        messages.forEach(message => {
            renderMessage(message);
        })
        
    }

    function renderMessage(message) {
        const user_ID = chatHead.attr('data-uid');
        const messageClass = user_ID == message.userID._id ? 'team_mate-message ' : 'your_message justify-end';
        chatWindow.append(`
            <div class="message-wrap d-flex ${messageClass}" data-user-id="${message.userID._id}" data-message-id="${message._id}" data-message="${message.message}" data-chat-id="${message.chatID}">
                                <div class="message-content-wrap">
                                    <span class="username text-xs text-gray">${message.userID.displayName || message.displayName}</span>
                                    <div class="message-body p-10 rounded-10 "><span class="text-sm">${message.message}</span></div>
                                </div>
                            </div>
        `)
    }

    loadUserChats();
});