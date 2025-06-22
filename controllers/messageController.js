import mongoose from 'mongoose';
import Message from '../models/message.js';


class MessageController {
    async sendMessage(req, res) {
        try {
            const { chatID, message } = req.body;
            const userID = req.user._id;
            const newMsg = await Message.create({ userID, chatID, message });
            newMsg.avatar = req.user.avatar;
            newMsg.displayName = req.user.displayName;
            res.status(201).json(newMsg);
        } catch (err) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    }

    async getChatMessages(req, res) {
        try {
            const { chatID } = req.params;
            const messages = await Message.find({ chatID }).sort({ createdAt: 1 })
            .populate('userID', 'displayName avatar');
            res.status(200).json(messages);
        } catch (err) {
            res.status(500).json({ error: 'Failed to get messages' });
        }
    }

    async updateMessage(req, res) {
        try {
            const { messageID } = req.params;
            const { newMessage } = req.body;
            const userID = req.user._id;
            const msg = await Message.findById(messageID);
            if (!msg || msg.userID.toString() !== userID) {
                return res.status(403).json({ error: 'Not authorized' });
            }

            msg.message = newMessage;
            msg.updatedAt = new Date();
            await msg.save();

            res.status(200).json(msg);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update message' });
        }
    }

    async deleteMessage(req, res) {
        try {
            const { messageID } = req.params;
            const { userID } = req.body;

            const msg = await Message.findById(messageID);
            if (!msg || msg.userID.toString() !== userID) {
                return res.status(403).json({ error: 'Not authorized' });
            }

            await msg.remove();
            res.status(200).json({ message: 'Deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete message' });
        }
    }
}

export default new MessageController;