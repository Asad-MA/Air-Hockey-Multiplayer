import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default  mongoose.model('Notification', notificationSchema);

