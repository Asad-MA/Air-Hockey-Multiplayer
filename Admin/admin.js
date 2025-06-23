import Database from './config/db.js';
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';
import User from './models/user.js';
import verficationToken from './models/verficationToken.js';
import blacklistToken from './models/blacklistToken.js';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import GameSetting from './models/gameSettings.js';
import authenticate from './middleware/authenticate.js';
import { adminLogin } from './controllers/adminAuth.js';
import getUserProfile from './controllers/userProfile.js';
import {updateUserStatus} from './controllers/updateUsers.js';

const app = express();
const PORT = 4000; // Admin Panel on different port


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(methodOverride('_method'));


app.use(express.static("public"));


app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

app.get('/', authenticate , async (req, res) => {
  res.render('dashboard');
});

app.get('/login', (req, res) => {
  res.render('login');
} );


app.post('/login', adminLogin);

app.put('/user-status', authenticate, updateUserStatus);
// Show Edit Form
app.get('/edit/:username',  [authenticate, getUserProfile], (req, res) => {
  const { user, stats } = req.profileData;

  res.render('edit', {
   user,
    profile: {
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
      coins: user.coins,
      createdAt: user.createdAt
    },
    stats
  });
});
  
  // Update User
  app.put('/edit/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
  });
  
  // Delete User
  app.delete('/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/');
  });

  // Delete Token
  app.delete('/delete-token/:id', async (req, res) => {
    await verficationToken.findByIdAndDelete(req.params.id);
    res.redirect('/');
  });

  // Game Settings
  // PUT /api/admin/game-settings
app.put('/api/admin/game-settings', async (req, res) => {
  const secret = req.headers['x-admin-secret'];
  // if (secret !== process.env.ADMIN_SECRET) return res.status(403).json({ message: 'Forbidden' });

  const data = req.body;

  await GameSetting.findOneAndUpdate({}, data, { upsert: true });
  res.json({ message: 'Game settings updated successfully' });
});


app.listen(PORT, () => console.log(`Admin Panel running on http://localhost:${PORT}`));