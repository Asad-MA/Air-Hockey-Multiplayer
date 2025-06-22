import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { errorMonitor } from 'events';

const authenticateAdmin = async (req, res, next) => {
  

//   console.log(token)

//     const email = 'admin@example.com';       // change as needed
//   const password = 'SuperSecure123';       // change before production
//   const name = 'The Overseer';

//   const existing = await Admin.findOne({ email });
//   if (existing) {
//     console.log('Admin already exists with this email.');
//     return process.exit();
//   }

//   const passwordHash = await bcrypt.hash(password, 10);

//   const admin = new Admin({
//     email,
//     passwordHash,
//     name,
//   });

//   await admin.save();
//   console.log('✅ Admin created successfully.');
    const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      throw new Error('Admin not found');
    }

    req.admin = {
      _id: admin._id,
      name: admin.name,
      email: admin.email
    };

    const newtoken = jwt.sign(
  { adminId: admin._id, email: admin.email },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: '1d' }
);

res.cookie('admin_token', newtoken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
});


    next();
  } catch (err) {
    console.log(errorMonitor)
    console.log('Admin auth failed:', err.message);
    res.clearCookie("admin_token");
    return res.status(401).redirect('/login');
  }
};

export default authenticateAdmin;
