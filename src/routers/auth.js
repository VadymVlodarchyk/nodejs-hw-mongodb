import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  refreshSessionController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../validation/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshSessionController);

// send reset email
router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  sendResetEmailController
);

// reset password
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordController
);

export default router;
