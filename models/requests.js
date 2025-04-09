import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdFor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    updatedAt: { type: Date, default: Date.now }
});

export default  mongoose.model('Request', requestSchema);

