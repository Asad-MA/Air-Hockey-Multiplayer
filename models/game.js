import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    gameMode: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    scoreLimit: {type: String, default: 'active' , required: true},
    status: { type: String, default: 'inprogress' },
    createdAt: { type: Date, default: Date.now },
} , {collection: "Game"});

export default mongoose.model("Game", gameSchema);