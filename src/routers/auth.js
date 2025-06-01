import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  refreshSessionController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
} from '../validation/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshSessionController);

export default router;
