// Dependencies
import express from 'express';
import friendController from '../controllers/FriendController.js';
import authenticate from '../middleware/authenticate.js';


// Codebase
const friendRoutes = express.Router();

// General Requests (Friend , Game , Challenge)
friendRoutes.post('/socail/friends/add' , authenticate  , friendController.sendRequest);

friendRoutes.get('/social/friends' , authenticate , (req , res) => res.render('pages/friends' , { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token }}));

friendRoutes.post('/social/friend/accept-request' , authenticate , friendController.acceptRequest);

friendRoutes.post('/social/friend/reject-request' , authenticate , friendController.rejectRequest);

friendRoutes.post('/social/friends/get' , authenticate , friendController.getFriends);

export default friendRoutes;