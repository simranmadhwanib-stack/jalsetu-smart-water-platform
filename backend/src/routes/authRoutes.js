import express from 'express';
import { login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

export const authRouter = express.Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', protect, me);
