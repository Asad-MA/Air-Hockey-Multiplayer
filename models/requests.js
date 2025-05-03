import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // message: { type: String, required: true },
    type: { type: String, required: true },
    
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    // expiresAt: { type: Date },
    updatedAt: { type: Date, default: Date.now }
});

export default  mongoose.model('Request', requestSchema);

