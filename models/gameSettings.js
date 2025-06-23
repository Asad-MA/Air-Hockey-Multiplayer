import mongoose from 'mongoose';

const gameSettingSchema = new mongoose.Schema({
  paddle: {
    mass: { type: Number, default: 1 },
    maxSpeed: { type: Number, default: 300 },
  },
  puck: {
    mass: { type: Number, default: 0.5 },
    maxSpeed: { type: Number, default: 500 },
    friction: { type: Number, default: 0.1 },
  },
  timeLimit:{
    type: Number,
    enum: [3, 6, 10, 20],
    default: 10, // Default time limit in minutes
  },
  entryFee: {
    type: Number,
    enum: [200, 400, 600, 800, 1000],
    default: 200,
  },
  rewardMultiplier: {
    type: Number,
    enum: [2, 4, 6],
    default: 2,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('GameSetting', gameSettingSchema);
