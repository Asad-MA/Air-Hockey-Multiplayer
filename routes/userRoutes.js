import express from 'express';
import userController from '../controllers/userController.js';
import verifyAccount from "../middleware/verifyAccount.js"
//const AuthService = require("../services/AuthService");
//const authMiddleware = require("../middleware/authMiddleware");
import path from "path";;

const userRoutes = express.Router();

userRoutes.get('/login' , (req , res)=>{
    res.render('pages/login' , {msg: 'Hello World', title: 'Login Page', layout: "layouts/main"});
})

userRoutes.get('/register' , (req , res)=>{
    res.render('pages/register' , {msg: 'Hello World'});
})

userRoutes.post('/register' , userController.handleRegister);

userRoutes.get('/verify/:userId' , verifyAccount , (req , res)=>{
    res.render('pages/verify-account');
})

export default userRoutes;