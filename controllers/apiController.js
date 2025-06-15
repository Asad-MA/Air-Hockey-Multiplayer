import user from "../models/user.js";
import Notification from '../models/notifications.js';
import gameRecord from "../models/gameRecord.js";

// Helper function to get date range based on period
import { getDateRange } from '../utils/dates.js';
import { timeToStr } from "../utils/humanReadableDate.js";


const API = {};

API.getNotifications = async (req, res) => {
  try {
    const {
      type,
      priority,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const userId = req.user._id; // Provided by auth middleware
    console.log('UserID' , req.user)
    const filter = { userId };

    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const notifications = await Notification
      .find(filter)
      .populate('requestId', 'title status') // Optional: enrich data
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: notifications,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (err) {
    console.error('Error in getNotifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



API.getUsers = async (req, res) => { 
    const allUsers = await user.find();
    res.status(200).json(allUsers);
}

API.getUser = (req, res) => {
    res.send('Hello User');
}

API.search = async (req , res) => {
    try {
        const { q } = req.query;
        const query = {};
    
        if (q) {
          query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ];
        }
    
        const users = await user.find(query);
    
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}


API.getLeaderboard = async (req, res)=>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'totalCoins';
  const period = req.query.period || 'all';

  const matchFilter = {};
  const dateRange = getDateRange(period);
  if (Object.keys(dateRange).length > 0) {
    matchFilter.startTime = dateRange;
  }

  try {
    const leaderboard = await gameRecord.aggregate([
      { $match: matchFilter },
      { $unwind: "$players" },
      { $group: {
          _id: "$players.user",
          totalCoins: { $sum: "$players.coinsEarned" },
          totalScore: { $sum: "$players.score" },
          gamesPlayed: { $sum: 1 },
        }},
      { $sort: { [sortBy]: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $lookup: {
          from: "Users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }},
      { $unwind: "$user" },
      { $project: {
          userId: "$user._id",
          displayName: "$user.displayName",
          avatar: "$user.avatar",
          totalCoins: 1,
          totalScore: 1,
          gamesPlayed: 1
        }}
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}

function getDateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

API.getRewardList = async (req, res) => {
  const userId = req.user._id;
  const User = await user.findById(userId);
  if (!User) return res.status(404).json({ message: 'User not found' });

  const now = new Date();
  const last = User.lastDailyReward;
  // const diff = last ? Math.floor((now - last) / (1000 * 60 * 60 * 24)) : null;

  const today = getDateOnly(new Date());
const lastDate = User.lastDailyReward ? getDateOnly(new Date(User.lastDailyReward)) : null;

const diff = lastDate ? Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)) : null;

  const todayClaimed = diff === 0;
  const streak = User.dailyStreak;

  const days = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    claimed: i + 1 < streak || (i + 1 === streak && todayClaimed),
    available: i + 1 === streak && !todayClaimed,
    reward: (30 * (i + 1)) * 10 // Example reward calculation
  }));

  res.json({ streak, todayClaimed, days });
}



API.claimReward = async (req, res) => {
  const userId = req.user._id; // assuming JWT middleware
  const User = await user.findById(userId);
  if (!User) return res.status(404).json({ message: 'User not found' });

  const now = new Date();
  const last = User.lastDailyReward;
  // const diff = last ? Math.floor((now - last) / (1000 * 60 * 60 * 24)) : null;


const today = getDateOnly(new Date());
const lastDate = User.lastDailyReward ? getDateOnly(new Date(User.lastDailyReward)) : null;

const diff = lastDate ? Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)) : null;


  if (diff === 0) {
    return res.status(400).json({ message: 'Already claimed today' });
  }

  console.log('Last Reward Date:', last);
  console.log('Current Date:', now);
  console.log('Days Difference:', diff);
  console.log('Current Streak:', User.dailyStreak);

  const streak = User.dailyStreak || 1;

  if (diff === 1) {
    User.dailyStreak += 1;
  } else {
    User.dailyStreak = 1;
  }

  User.lastDailyReward = now;

  const coinsEarned = (30 * streak) * 10;
  User.coins += coinsEarned;

  await User.save();

  res.json({
    message: 'Daily reward claimed',
    streak: user.dailyStreak,
    coinsEarned
  });
}

/* Match History */ 
API.getMatchHistory = async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort === 'oldest' ? 1 : -1;
  const resultFilter = req.query.result;

  const matchFilter = { 'players.user': userId };
  if (resultFilter === 'win') matchFilter.winner = userId;
  if (resultFilter === 'lose') matchFilter.winner = { $ne: userId };

  try {
    const total = await gameRecord.countDocuments(matchFilter);

    const records = await gameRecord.find(matchFilter)
      .sort({ startTime: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('players.user', 'displayName avatar')
      .populate('winner', 'displayName');

    const formatted = records.map((record) => {
      const [p1, p2] = record.players;
      const isPlayer1 = String(p1.user._id) === String(userId);
      const me = isPlayer1 ? p1 : p2;
      const opponent = isPlayer1 ? p2 : p1;

      console.log(record.winner, userId);

      return {
        matchId: record._id,
        startTime: record.startTime,
        endTime: record.endTime,
        duration: record.endTime - record.startTime,
        timeToStr: timeToStr(record.startTime),
        player: {
          name: me.user.displayName,
          avatar: me.user.avatar,
          score: me.score,
        },
        opponent: {
          name: opponent.user.displayName,
          avatar: opponent.user.avatar,
          score: opponent.score,
        },
        result: String(record.winner?._id) == String(userId) ? 'win' : 'lose',
      };
    });

    res.json({ total, page, limit, matches: formatted });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}


export default API;