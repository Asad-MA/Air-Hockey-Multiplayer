import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true, unique: true },
    ip: { type: String, required: true }, // IP Binding
    userAgent: {
        ua: { type: String, required: true }, // Full User-Agent String
        browser: {
            name: String,
            version: String,
            major: String
        },
        engine: {
            name: String,
            version: String
        },
        os: {
            name: String,
            version: String
        }
    },
    createdAt: { type: Date, default: Date.now, expires: "7d" } // Auto-expiry in 7 days
});


export default mongoose.model("RefreshToken", RefreshTokenSchema);
