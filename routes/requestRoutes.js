// Dependencies
import express from 'express';
import requestController from '../controllers/requestController.js';
import authenticate from '../middleware/authenticate.js';


// Codebase
const requestRoutes = express.Router();

// General Requests (Challenge / Game Invites / Party)
requestRoutes.post('/social/challenge/send', authenticate, requestController.sendChallenge);

requestRoutes.post('/social/challenge/accept', authenticate, requestController.acceptChallenge);

requestRoutes.post('/social/challenge/reject', authenticate, requestController.rejectChallenge);

requestRoutes.post('/social/challenge/cancel', authenticate, requestController.cancelChallenge);

// requestRoutes.post('/social/challenges/incoming', authenticate, requestController.getIncomingChallenges);

// requestRoutes.post('/social/challenges/sent', authenticate, requestController.getSentChallenges);

export default requestRoutes;