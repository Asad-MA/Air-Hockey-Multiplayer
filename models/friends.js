import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    friendID: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    status: {type: String, default: 'active' , required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
} , {collection: "Friends"});

export default mongoose.model("Friends", friendSchema);