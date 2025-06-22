import mongoose from 'mongoose';
import Chat from '../models/chats.js';
import message from '../models/message.js';
import user from '../models/user.js';

class ChatController {
    async startChat(req, res) {
        const { friendID } = req.body;
        const userID = req.user._id;

        if (!userID || !friendID) {
            return res.status(400).json({ error: 'Both userID and friendID are required' });
        }

        // Prevent self-chat
        if (userID === friendID) {
            return res.status(400).json({ error: 'Cannot start chat with yourself' });
        }

        // Validate both IDs
        if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(friendID)) {
            return res.status(400).json({ error: 'Invalid userID or friendID' });
        }

        let chat = await Chat.findOne({
            $or: [
                { userID, friendID },
                { userID: friendID, friendID: userID }
            ]
        });

        if (!chat) {
            chat = await Chat.create({ userID, friendID });
        }

        return res.status(200).json(chat);
    }

    async getUserChats(req, res) {
        const userID = req.user._id; // From JWT

        try {
            const chats = await Chat.find({
                $or: [{ userID }, { friendID: userID }]
            });

            const results = await Promise.all(
                chats.map(async (chat) => {
                    const isUserA = chat.userID.toString() === userID.toString();
                    const friendID = isUserA ? chat.friendID : chat.userID;

                    const friend = await user.findById(friendID).select('displayName avatar');
                    const lastMessage = await message.findOne({ chatID: chat._id })
                        .sort({ createdAt: -1 })
                        .select('message createdAt');

                    return {
                        chatID: chat._id,
                        friend: {
                            _id: friend._id,
                            displayName: friend.displayName,
                            avatar: friend.avatar
                        },
                        lastMessage: lastMessage?.message || '',
                        lastMessageTime: lastMessage?.createdAt || null
                    };
                })
            );

            res.status(200).json(results);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: 'Failed to load user chats' });
        }
    }


}

export default new ChatController;