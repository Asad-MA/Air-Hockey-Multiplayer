import Database from './config/db.js';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';



const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(userRoutes);

app.use(express.static("public"));

app.set('view engine', 'ejs');




// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

