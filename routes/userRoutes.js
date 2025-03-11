import express from 'express';
import userController from '../controllers/userController.js';
import verifyAccount from "../middleware/verifyAccount.js";
import authenticate from '../middleware/authenticate.js';
//const AuthService = require("../services/AuthService");
//const authMiddleware = require("../middleware/authMiddleware");

import requestsValidator from "../middleware/validateUserRequests.js";
import path from "path";

const userRoutes = express.Router();

userRoutes.get('/login' , (req , res)=>{
    res.render('pages/login' );
})

userRoutes.get('/register' , (req , res)=>{
    res.render('pages/register' , {msg: 'Hello World'});
})

userRoutes.post('/register' , requestsValidator.validateRegister,  userController.handleRegister);

userRoutes.post('/login' ,  userController.handleLogin);

userRoutes.get('/logout' , userController.handleLogout);

userRoutes.get('/verify/:userId' , verifyAccount , (req , res)=>{
    res.render('pages/verify-account');
});

userRoutes.get('/' , authenticate , (req , res)=>{ res.render('pages/dashboard' , {name: req.user.name , email: req.user.email}) })


userRoutes.post('resend-verification-mail' , userController.resendMail);

export default userRoutes;