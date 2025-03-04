import express from 'express';
//const AuthService = require("../services/AuthService");
//const authMiddleware = require("../middleware/authMiddleware");
import path from "path";;

const userRoutes = express.Router();

userRoutes.get('/login' , (req , res)=>{
    res.render('pages/login' , {msg: 'Hello World'});
})

userRoutes.get('/register' , (req , res)=>{
    res.render('pages/register' , {msg: 'Hello World'});
})

export default userRoutes;