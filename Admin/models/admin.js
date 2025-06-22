// models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Admin', adminSchema);
