import Admin from '../models/admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join("./config/", ".env") });

export const adminLogin = async (req, res) => {
  const { email, password, remember } = req.body;

  try {
    // Validate input
    const errors = {};
    if (!email) errors.email = ['Email is required'];
    if (!password) errors.password = ['Password is required'];

    if (Object.keys(errors).length) {
      return res.status(400).json(errors);
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ email: ['No admin found with this email'] });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ password: ['Incorrect password'] });
    }

    // Generate JWT
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: remember ? '7d' : '1d' }
    );

    // Set cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 7 days or 1 day
    });

    res.json({ token, message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};
