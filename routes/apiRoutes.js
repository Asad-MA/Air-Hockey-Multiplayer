import express from 'express';
import API from '../controllers/apiController.js';

const apiRoutes = express.Router();

apiRoutes.get('/' , (req , res) => res.send('Hello World'));

apiRoutes.get('/users' , API.getUsers);

apiRoutes.get('/users/search' , API.getUsers);

apiRoutes.get('/user/:id' , API.getUser);



export default apiRoutes;