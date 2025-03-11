const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true, unique: true },
    ip: { type: String, required: true }, // IP Binding
    userAgent: { type: String, required: true }, // Device Tracking
    createdAt: { type: Date, default: Date.now, expires: "7d" } // Auto-expiry in 7 days
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
