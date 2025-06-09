import GameRecord from '../models/gameRecord.js';
import mongoose from 'mongoose';

export const getMyStats = async (req, res) => {
  try {
    const playerId = new mongoose.Types.ObjectId(req.user._id); // from token middleware
console.log("Player ID:", playerId);
    const allRecords = await GameRecord.find({ 'players.user': req.user._id })
      .sort({ endTime: -1 })
      .select('winner');

    const totalGames = allRecords.length;
    const totalWins = allRecords.filter(r => r.winner?.toString() === playerId.toString()).length;
    const totalLosses = totalGames - totalWins;
    const winPercentage = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : 0;

    let streak = 0;
    for (const record of allRecords) {
      if (record.winner?.toString() === playerId.toString()) {
        streak++;
      } else {
        break;
      }
    }

    const lastGame = allRecords[0];
    const lastStatus = lastGame
      ? (lastGame.winner?.toString() === playerId.toString() ? 'Win' : 'Lose')
      : 'N/A';

    res.json({
      totalGames,
      totalWins,
      totalLosses,
      winPercentage,
      winningStreak: streak,
      lastGameStatus: lastStatus
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
