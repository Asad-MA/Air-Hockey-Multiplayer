import mongoose from "mongoose";

const gameRecordSchema = new mongoose.Schema({
  gameID: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },

  players: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, default: 0 },
    coinsEarned: { type: Number, default: 0 }
  }],

  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: "GameRecord" });


export default mongoose.model("GameRecord", gameRecordSchema);