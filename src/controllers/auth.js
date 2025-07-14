import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  sendResetEmail,
  resetUserPassword,
} from '../services/auth.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await registerUser({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await loginUser({ email, password });

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
};

export const logoutController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw createError(401, 'Not authorized');
  }

  await logoutUser(refreshToken);

  res.clearCookie('refreshToken').status(204).send();
};

export const refreshSessionController = async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  if (!oldRefreshToken) {
    throw createError(401, 'Not authorized');
  }

  const { accessToken, refreshToken } = await refreshSession(oldRefreshToken);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
};

// send reset password email
export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const isSent = await sendResetEmail({ to: email, resetLink });

  if (!isSent) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

// NEW: reset password controller
export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    await resetUserPassword({ email, password });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    throw createError(401, 'Token is expired or invalid.');
  }
};
