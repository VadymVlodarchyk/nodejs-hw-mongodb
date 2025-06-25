import createError from 'http-errors';
import { Contact } from '../models/contactModel.js';

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const contacts = await Contact.find({ owner });

  res.status(200).json({
    status: 200,
    message: 'Success',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const contact = await Contact.findOne({ _id: contactId, owner });
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Success',
    data: contact,
  });
};

export const addContact = async (req, res) => {
  const { _id: owner } = req.user;

  const photo = req.file?.path || '';

  const newContact = await Contact.create({
    ...req.body,
    photo,
    owner,
  });

  res.status(201).json({
    status: 201,
    message: 'Contact added successfully',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const update = { ...req.body };
  if (req.file?.path) {
    update.photo = req.file.path;
  }

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    update,
    { new: true }
  );

  if (!updatedContact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Contact updated successfully',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const deleted = await Contact.findOneAndDelete({ _id: contactId, owner });

  if (!deleted) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Contact deleted successfully',
    data: deleted,
  });
};
