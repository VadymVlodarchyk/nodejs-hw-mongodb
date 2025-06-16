import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../services/cloudinary.js';

const router = express.Router();

// Отримати всі контакти
router.get(
  '/',
  authenticate,
  ctrlWrapper(getContactsController)
);

// Отримати контакт по ID
router.get(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(getContactByIdController)
);

// Створити новий контакт (завантаження фото)
router.post(
  '/',
  (req, res, next) => {
    console.log('📍 STEP 1: Request received');
    next();
  },
  authenticate,
  (req, res, next) => {
    console.log('📍 STEP 2: Passed authenticate');
    next();
  },
  upload.single('photo'),
  (req, res, next) => {
    console.log('📍 STEP 3: Passed upload');
    next();
  },
  ctrlWrapper(createContactController)
);

// Оновити контакт по ID 
router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  upload.single('photo'),
  ctrlWrapper(updateContactController)
);

// Видалити контакт
router.delete(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteContactController)
);

export default router;
