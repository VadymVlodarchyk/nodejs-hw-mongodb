import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { sendEmail } from '../services/email.js';
import { User } from '../models/userModel.js';

const { JWT_SECRET, APP_DOMAIN } = process.env;

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

 
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const payload = { email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });


  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  const isEmailSent = await sendEmail({
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Hello,</p>
      <p>To reset your password, click the link below:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link is valid for 5 minutes.</p>
    `,
  });

  if (!isEmailSent) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};
