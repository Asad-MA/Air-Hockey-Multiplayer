import express from 'express';
import userController from '../controllers/userController.js';
import verifyAccount from "../middleware/verifyAccount.js";
import verifyResetPassword from '../middleware/verify-reset-pass.js';
import authenticate from '../middleware/authenticate.js';
import requestsValidator from "../middleware/validateUserRequests.js";
import path from "path";

const userRoutes = express.Router();

userRoutes.get('/login', (req, res) => { res.render('pages/login') })

userRoutes.get('/register', (req, res) => { res.render('pages/register') })

userRoutes.get('/logout', userController.handleLogout);

userRoutes.get('/forget-password', (req, res) => { res.render('pages/forget-password') });

userRoutes.get('/reset-password/:userId', verifyResetPassword, (req, res) => { res.render('pages/reset-password', { id: req.params.userId, token: req.query.token }) });

userRoutes.get('/verify/:userId', verifyAccount, (req, res) => { res.render('pages/verify-account') });

userRoutes.get('/', authenticate, (req, res) => {
    // console.log('User: ', req.user);
    res.render('pages/dashboard', { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token, avatar: req.user.avatar }})
})

userRoutes.get('/social/profile/:username' , authenticate , (req , res) => {
    res.render('pages/profile',  { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token }});
})

userRoutes.post('/register', requestsValidator.validateRegister, userController.handleRegister);

userRoutes.post('/login', userController.handleLogin);

userRoutes.post('/reset-password-request', userController.handleResetPasswordRequest);

userRoutes.post('/reset-password', userController.resetPassword);

userRoutes.post('resend-verification-mail', userController.resendMail);


// Game Routes
userRoutes.get('/matchmaking', authenticate, (req, res) => res.render('pages/lobby'))

userRoutes.get('/play-live/:roomId', authenticate,  (req, res) => {
    res.render('pages/game', { roomID: req.params.roomId,  user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token, avatar: req.user.avatar }})
}
);

export default userRoutes;