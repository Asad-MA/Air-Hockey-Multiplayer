import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    displayName: {type: String, required: true},
    email: { type: String, required: true, unique: true, index:true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String },
    status: { type: String},
    accountStatus: { type: String , default: 'active'},
    createdAt: { type: Date, default: Date.now }
}, {collection: "Users"});

export default mongoose.model("User", userSchema);