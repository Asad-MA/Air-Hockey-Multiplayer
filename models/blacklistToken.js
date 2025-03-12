import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true }, // Stores the blacklisted JWT token
    expiresAt: { type: Date, required: true } // Expiry timestamp for auto-removal
}, { collection: "blacklistedtokens" });

// TTL index to remove documents after 15 minutes (900 seconds)
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 900 });

export default mongoose.model("blacklistedToken", blacklistedTokenSchema);