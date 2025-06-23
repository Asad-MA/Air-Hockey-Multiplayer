import mongoose from 'mongoose';

import user from "../models/user.js";
import gameRecord from "../models/gameRecord.js";
import Friend from "../models/friends.js";

export default async (req, res, next) => {
  try {
    const username = req.params.username;

    // 1. Find the user
    const userObj = await user.findOne({ name: username }).select('-password');
    if (!userObj) return res.status(404).send('User not found');

    const userId = new mongoose.Types.ObjectId(userObj._id);

    // 2. Get game records
    const records = await gameRecord.find({ 'players.user': userId })
      .sort({ endTime: -1 })
      .select('winner');

    const totalGames = records.length;
    const totalWins = records.filter(r => r.winner?.toString() === userId.toString()).length;
    const totalLosses = totalGames - totalWins;
    const winPercentage = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : 0;

    let winStreak = 0;
    for (const record of records) {
      if (record.winner?.toString() === userId.toString()) {
        winStreak++;
      } else break;
    }

    // 3. Friend info
    const totalFriends = await Friend.countDocuments({
      $or: [
        { requester: userId, status: 'active' },
        { recipent: userId, status: 'active' }
      ]
    });

    // 4. Send to EJS
    // req.user = 
    req.profileData = {
      user: userObj,
      stats: {
        totalGames,
        totalWins,
        totalLosses,
        winPercentage,
        winStreak,
        totalFriends
      }
    };

    next();

  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).send('Server error');
  }
}