import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  refreshSessionController,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
} from '../validation/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshSessionController);
router.post('/send-reset-email', validateBody(emailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

export default router;
