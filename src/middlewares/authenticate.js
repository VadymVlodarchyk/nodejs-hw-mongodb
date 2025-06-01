import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Session } from '../models/sessionModel.js';
import { User } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(createError(401, 'Unauthorized: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Invalid session');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createError(401, 'Access token expired');
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, error.message || 'Unauthorized'));
  }
};
