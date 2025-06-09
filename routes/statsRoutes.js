import express from 'express';
import authenticate from '../middleware/authenticate.js';
import requestsValidator from "../middleware/validateUserRequests.js";
import path from "path";
import { getMyStats } from '../controllers/statsController.js';


const statsRouter = express.Router();

statsRouter.get('/api/stats/dashboard/mini', authenticate, getMyStats);

export default statsRouter;