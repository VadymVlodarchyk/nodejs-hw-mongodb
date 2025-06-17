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

router.get('/', authenticate, ctrlWrapper(getContactsController));

router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  authenticate,
  upload.single('photo'),
  ctrlWrapper(createContactController)
);

router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  upload.single('photo'),
  ctrlWrapper(updateContactController)
);

router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContactController));

export default router;
