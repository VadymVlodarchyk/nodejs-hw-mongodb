import mongoose from 'mongoose';
import createError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

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

  const userId = req.user._id;

  const totalItems = await getAllContacts(userId, filter).then(data => data.length);
  const contacts = await getAllContacts(userId, filter, {
    sort,
    skip,
    limit: Number(perPage),
  });

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

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const contact = await getContactById(contactId.trim(), req.user._id);
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
  try {
    const { name, phoneNumber, contactType, email, isFavourite } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw createError(400, 'Missing required fields: name, phoneNumber, contactType');
    }

    const photo = req.file?.path || req.file?.url || '';
    console.log('📸 CREATE file:', req.file);

    const newContactData = {
      name,
      phoneNumber,
      contactType,
      email,
      isFavourite: String(isFavourite).toLowerCase() === 'true',
      userId: req.user._id,
      photo,
    };

    const newContact = await addContact(newContactData);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    console.error('❌ CREATE error:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: error.stack || error.message || 'Internal Server Error',
    });
  }
};

export const updateContactController = async (req, res) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createError(400, 'Invalid contact ID format');
    }

    if (!req.user || !req.user._id) {
      throw createError(401, 'Unauthorized: missing user ID');
    }

    const updateData = { ...req.body };

    console.log('🧩 PATCH req.file:', req.file);

    if (req.file) {
      const { path, url, filename } = req.file;
      const photoUrl = path || url || filename;
      if (photoUrl) {
        updateData.photo = photoUrl;
      } else {
        console.warn('⚠️ Photo not found in file object');
      }
    }

    const updatedContact = await updateContactById(contactId.trim(), req.user._id, updateData);

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    console.error('❌ PATCH error:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: error.stack || error.message || 'Internal Server Error',
    });
  }
};


export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await deleteContactById(contactId.trim(), req.user._id);
  if (!result) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
