import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    gameMode: {type: String, enum: ['PVP' , 'PVC'] , required: true},
    type: {type: String, enum: ['challenge' , 'normal' , 'room'] , default: 'normal', required: true},
    scoreLimit: {type: String, default: 'active' , required: true},
    status: { type: String, enum: ['inprogress' , 'finished'] , default: 'inprogress' },
    endReason: {type: String , enum: ['aborted' , 'network' , 'finished']},
    createdAt: { type: Date, default: Date.now },
} , {collection: "Game"});

export default mongoose.model("Game", gameSchema);