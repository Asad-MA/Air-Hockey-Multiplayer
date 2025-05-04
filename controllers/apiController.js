import user from "../models/user.js";
import Notification from '../models/notifications.js';

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



export default API;