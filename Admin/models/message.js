import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    chatID: {type: mongoose.Schema.Types.ObjectId , ref: 'chats' , required: true},
    message: {type: String, required: true},
    isViewed: {type: Boolean, required: true , default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
} , {collection: "Messages"});

export default mongoose.model("Messages", messageSchema);