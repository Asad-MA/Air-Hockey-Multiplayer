import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    type: { type: String, required: true },
    title: {type:String , required: true , default: 'New Notification'},
    message: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' },
    
    createdAt: { type: Date, default: Date.now }
});

export default  mongoose.model('Notification', notificationSchema);

