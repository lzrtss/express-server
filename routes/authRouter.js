import { Router } from 'express';
import {
  signup,
  login,
  logout,
  refresh,
} from '../controllers/authController.js';
import {
  protectRoute,
  validateUserData,
} from '../middleware/authMiddleware.js';

const authRouter = new Router();

authRouter
  .post('/signup', validateUserData, signup)
  .post('/login', login)
  .post('/logout', logout)
  .get('/refresh', protectRoute, refresh);

export default authRouter;
