import mongoose from "mongoose";
// Reference: https://chatgpt.com/share/67d1dc9e-e8d4-800b-a9f6-7477e4894b0d
const statsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    wins: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    lastMatch: { type: Date, default: Date.now } // Timestamp of last match
});

const Stats = mongoose.model('UserStats', statsSchema);