import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactSchemas.js';

import { upload } from '../middlewares/upload.js'; // ✅ додаємо upload

const router = express.Router();

// 🔒 Захищаємо всі запити авторизацією
router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  upload.single('photo'), // ✅ додаємо підтримку завантаження фото
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'), // ✅ теж додаємо фото при оновленні
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
