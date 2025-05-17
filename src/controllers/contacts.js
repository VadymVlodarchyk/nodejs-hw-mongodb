import mongoose from 'mongoose';
import {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }
    const contact = await getContactById(contactId.trim());
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, contactType, email, isFavourite } = req.body;
    if (!name || !phoneNumber || !contactType) {
      return res.status(400).json({
        status: 400,
        message: 'Missing required fields: name, phoneNumber, contactType',
      });
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
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }
    const updatedContact = await updateContactById(contactId.trim(), req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }
    const result = await deleteContactById(contactId.trim());
    if (!result) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
