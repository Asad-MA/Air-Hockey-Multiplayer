import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    token: { type: String, required: true },
    type: {type: String, required: true,  default: 'mail'},
    expiresAt: { type: Date, required: true , default: () => new Date(Date.now() + 60 * 60 * 1000)} ,
    
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60   // Auto-delete after 7 days (in seconds)
      }
}, {collection: "emailTokens"});

export default mongoose.model("veificationToken", tokenSchema);