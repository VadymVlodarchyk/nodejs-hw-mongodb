import '../config/env.js'; // 🔁 підключаємо конфіг глобально
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
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
    console.log('✅ decoded JWT:', decoded);

    const userId = decoded.userId || decoded._id;
    if (!userId) {
      throw createError(401, 'Invalid token payload');
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    next(createError(401, error.message || 'Unauthorized'));
  }
};
