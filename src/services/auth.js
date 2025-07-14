import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import nodemailer from 'nodemailer';

import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

const generateTokens = (userId) => {
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw createError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createError(401, 'Invalid email or password');

  await Session.deleteMany({ userId: user._id });

  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = generateTokens(user._id);

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  await session.save();

  return { accessToken, refreshToken };
};

export const logoutUser = async (refreshToken) => {
  await Session.findOneAndDelete({ refreshToken });
};

export const refreshSession = async (oldRefreshToken) => {
  const existingSession = await Session.findOne({ refreshToken: oldRefreshToken });

  if (!existingSession) throw createError(401, 'Invalid refresh token');

  const { userId } = jwt.verify(oldRefreshToken, JWT_SECRET);

  await Session.deleteMany({ userId });

  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = generateTokens(userId);

  const newSession = new Session({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  await newSession.save();

  return { accessToken, refreshToken };
};

// send reset password email via Brevo
export const sendResetEmail = async ({ to, resetLink }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your password',
    html: `<p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  try {
    await transporter.sendMail(emailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error.message);
    return false;
  }
};

// NEW: reset user password
export const resetUserPassword = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });
};
