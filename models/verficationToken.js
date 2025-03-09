import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true , default: () => new Date(Date.now() + 60 * 60 * 1000)} ,
    
    createdAt: { type: Date, default: Date.now }
}, {collection: "emailTokens"});

export default mongoose.model("veificationToken", tokenSchema);