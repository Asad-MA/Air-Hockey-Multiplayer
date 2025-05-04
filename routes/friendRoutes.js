// Dependencies
import express from 'express';
import friendController from '../controllers/FriendController.js';
import authenticate from '../middleware/authenticate.js';


// Codebase
const friendRoutes = express.Router();

// General Requests (Friend , Game , Challenge)
friendRoutes.post('/socail/add-friend' , authenticate  , friendController.sendRequest);

friendRoutes.get('/friends' , authenticate , (req , res) => res.render('pages/friends' , { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token }}));


export default friendRoutes;