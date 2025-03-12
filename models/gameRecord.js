import mongoose from "mongoose";

const gameRecordSchema = new mongoose.Schema({
    gameID: {type: mongoose.Schema.Types.ObjectId , ref: 'Game' , required: true},
    gameMode: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    player1: {type: String, required: true},
    player2: { type: String, required: true},
    scores: {},
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
} , {collection: "GameRecord"});

export default mongoose.model("GameRecord", gameRecordSchema);