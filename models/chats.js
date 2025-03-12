import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    friendID: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    status: {type: String, default: 'active' , required: true}
} , {collection: "chats"});

export default mongoose.model("chats", chatSchema);