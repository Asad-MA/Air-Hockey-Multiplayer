import express from 'express';
import userController from '../controllers/userController.js';
import API from '../controllers/apiController.js';
import verifyAccount from "../middleware/verifyAccount.js";
import verifyResetPassword from '../middleware/verify-reset-pass.js';
import authenticate from '../middleware/authenticate.js';
import requestsValidator from "../middleware/validateUserRequests.js";
import path from "path";

const userRoutes = express.Router();

userRoutes.get('/login', (req, res) => { res.render('pages/login' , {query: req.query }) })

userRoutes.get('/register', (req, res) => { res.render('pages/register') })

userRoutes.get('/logout', userController.handleLogout);

userRoutes.get('/forget-password', (req, res) => { res.render('pages/forget-password') });

userRoutes.get('/reset-password/:userId', verifyResetPassword, (req, res) => { res.render('pages/reset-password', { id: req.params.userId, token: req.query.token }) });

userRoutes.get('/verify/:userId', verifyAccount, (req, res) => { res.render('pages/verify-account') });

userRoutes.get('/', authenticate, (req, res) => {
    // console.log('User: ', req.user);
    res.render('pages/dashboard', { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token, avatar: req.user.avatar, coins: req.user.coins }});
})

userRoutes.get('/leaderboards', authenticate, (req, res) => {
    // console.log('User: ', req.user);
    res.render('pages/leaderboards', { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token, avatar: req.user.avatar, coins: req.user.coins }});
})

userRoutes.get('/settings', [authenticate , API.getUserSettings], (req, res) => {
    const { user } = req.profileData;
    // console.log('User: ', req.user);
    res.render('pages/settings', {
    user: {
      name: req.user.name,
      displayName: req.user.displayName,
      email: req.user.email,
      token: req.user.token,
      avatar: req.user.avatar,
      coins: req.user.coins
    },
  });
    })

userRoutes.get('/social/profile/:username', [authenticate, API.getUserProfile], (req, res) => {
  const { user, stats } = req.profileData;

  res.render('pages/profile', {
    user: {
      name: req.user.name,
      displayName: req.user.displayName,
      email: req.user.email,
      token: req.user.token,
      avatar: req.user.avatar,
      coins: req.user.coins
    },
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

userRoutes.get('/play-offline/', authenticate,  (req, res) => {
    res.render('pages/game-offline', { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token, avatar: req.user.avatar }})
}
);

export default userRoutes;