// Dependencies
import express from 'express';
import friendController from '../controllers/FriendController.js';
import authenticate from '../middleware/authenticate.js';
import chatController from '../controllers/chatController.js';
import messageController from '../controllers/messageController.js';


// Codebase
const socialRoutes = express.Router();

// General Requests (Friend , Game , Challenge)
socialRoutes.post('/friends/add' , authenticate  , friendController.sendRequest);

socialRoutes.get('/friends' , authenticate , (req , res) => res.render('pages/friends' , { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token }}));

socialRoutes.post('/friend/accept-request' , authenticate , friendController.acceptRequest);

socialRoutes.post('/friend/reject-request' , authenticate , friendController.rejectRequest);

socialRoutes.post('/friends/get' , authenticate , friendController.getFriends);


// 
socialRoutes.get('/chat' , authenticate , (req , res) => res.render('pages/chat' , { user: {name: req.user.name, displayName: req.user.displayName, email: req.user.email, token: req.user.token }}));                  
export default socialRoutes;

// Start Chat
socialRoutes.post('/chat/start' , authenticate , chatController.startChat);

// Load Messages
socialRoutes.get('/chat/messages/:chatID' , authenticate , messageController.getChatMessages);

socialRoutes.post('/chat/messages/' , authenticate , messageController.sendMessage);

socialRoutes.post('/chat/user/' ,  authenticate , chatController.getUserChats);