import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    requester: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    recipent: {type: mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},
    requestId: {type: mongoose.Schema.Types.ObjectId , ref: 'Request' , required: true},
    status: {type: String, default: 'pending' , required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
} , {collection: "FriendShips"});

export default mongoose.model("FriendShips", friendSchema);