import express from 'express';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contactsController.js';
console.log('✅ contactsRouter loaded');

const router = express.Router();

router.get('/', getContactsController);
router.get('/:contactId', getContactByIdController);

export default router;
