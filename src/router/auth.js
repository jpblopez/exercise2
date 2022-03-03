import { Router } from 'express';
import authController from '../controllers/auth.js';
import { login, register } from '../middleware/auth.js';
const router = Router();

router.get('/', authController.get);
router.post('/login', login, authController.login);
router.post('/register', register, authController.register);
router.get('/tweet', authController.tweet);
router.post('/post-tweet', authController.postTweet);

export default router;
