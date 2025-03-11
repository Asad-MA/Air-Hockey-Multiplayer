import Database from '../config/db.js';
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';
import User from '../models/user.js';
import verficationToken from '../models/verficationToken.js';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

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

app.get('/', async (req, res) => {
  const users = await User.find();
  const emailTokens = await verficationToken.find();
  res.render('users', { users , emailTokens });
});

// Show Edit Form
app.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('edit', { user });
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

app.listen(PORT, () => console.log(`Admin Panel running on http://localhost:${PORT}`));