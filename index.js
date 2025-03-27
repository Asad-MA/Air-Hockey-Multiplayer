import Database from './config/db.js';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import defaultAuth from './middleware/api/defaultAuth.js';
import wss from './ws-channel.js';





const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
//app.use(express.urlencoded({ extended: true }));



app.use(userRoutes);



app.use(express.static("public"));



app.set('view engine', 'ejs');

app.use((err, req, res, next) => {
  res.status(err.status || 500).render("pages/error", {
      title: err.title || "Something Went Wrong",
      message: err.message || "An unexpected error occurred.",
      suggestion: err.suggestion || "Please try again later or contact support."
  });
});


// API Routes
// app.use('/api', defaultAuth);
// app.use('/api', apiRoutes);






// Start Server
app.listen(PORT, async() => {
  console.log(`Server running on port ${PORT}`);
});

