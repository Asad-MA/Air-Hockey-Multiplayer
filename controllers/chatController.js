import Chat from '../models/chats.js';

class ChatController {
    async startChat(req, res) {
        const { userID, friendID } = req.body;

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
        const { userID } = req.params;
        try {
            const chats = await Chat.find({
                $or: [{ userID }, { friendID: userID }]
            }).populate('userID friendID', 'displayName avatar');

            res.status(200).json(chats);
        } catch (err) {
            res.status(500).json({ error: 'Failed to load chats' });
        }
    }
}