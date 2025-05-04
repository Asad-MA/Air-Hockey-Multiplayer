import express from 'express';
import authenticate from '../middleware/authenticate.js';
import API from '../controllers/apiController.js';

const apiRoutes = express.Router();

apiRoutes.get('/' , (req , res) => res.send('Air Hockey Multiplayer API version 1.0.0'));

apiRoutes.get('/users' , API.getUsers);

apiRoutes.get('/users/search' , API.search);

apiRoutes.get('/user/:id' , API.getUser);

apiRoutes.get('/notifications/', authenticate , API.getNotifications);



export default apiRoutes;