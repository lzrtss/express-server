import { Router } from 'express';
import { activate, getMe } from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const userRouter = new Router();

userRouter
  .get('/activate/:link', activate)
  .get('/me', protectRoute, getMe);

export default userRouter;
