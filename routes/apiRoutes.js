import express from 'express';
import authenticate from '../middleware/authenticate.js';
import API from '../controllers/apiController.js';

const apiRoutes = express.Router();

apiRoutes.get('/' , (req , res) => res.send('Air Hockey Multiplayer API version 1.0.0'));

apiRoutes.get('/users' , API.getUsers);

apiRoutes.get('/users/search' , API.search);

apiRoutes.get('/user/:id' , API.getUserProfile);


apiRoutes.get('/notifications/', authenticate , API.getNotifications);

apiRoutes.get('/leaderboard', API.getLeaderboard);

apiRoutes.get('/matchhistory' , API.getMatchHistoryA);

apiRoutes.get('/matchhistory/:userId' , API.getMatchHistoryA);

apiRoutes.get('/match-history', authenticate, API.getMatchHistory);

apiRoutes.get('/rewards/daily/status', authenticate, API.getRewardList);

apiRoutes.post('/rewards/daily', authenticate, API.claimReward);

apiRoutes.post('/user/update-settings', authenticate, API.updateProfileSettings)


export default apiRoutes;