import mongoose from 'mongoose';
import createError from 'http-errors';
import {
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
import { Contact } from '../models/contactModel.js'; // Потрібен для пагінації

// ✅ ОНОВЛЕНИЙ
export const getContactsController = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(perPage));

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      hasPreviousPage: Number(page) > 1,
      hasNextPage: skip + contacts.length < totalItems,
    },
  });
};

// Інші контролери — без змін:
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const contact = await getContactById(contactId.trim());
  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { name, phoneNumber, contactType, email, isFavourite } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields: name, phoneNumber, contactType');
  }

  const newContact = await addContact({
    name,
    phoneNumber,
    contactType,
    email,
    isFavourite,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const updatedContact = await updateContactById(contactId.trim(), req.body);
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const result = await deleteContactById(contactId.trim());
  if (!result) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
