import User from '../models/user.js';

export const updateUserStatus = async (req, res) => {
  const { userId, action } = req.body;

  if (!userId || !['block', 'unblock'].includes(action)) {
    return res.status(400).json({ error: 'Invalid userId or action' });
  }

  const newStatus = action === 'block' ? 'blocked' : 'active';

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { accountStatus: newStatus },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User ${action}ed successfully`,
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        accountStatus: updatedUser.accountStatus
      }
    });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};
