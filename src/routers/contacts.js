import express from 'express';
import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadSingle } from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../validation/contactSchemas.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:contactId', getContactById);
router.post('/', uploadSingle, validateBody(contactSchema), addContact);
router.patch('/:contactId', uploadSingle, validateBody(contactSchema), updateContact);
router.delete('/:contactId', deleteContact);

export default router;
