import { Contact } from '../models/contactModel.js';

export const getAllContacts = async () => {
  return Contact.find();
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const addContact = async (data) => {
  const newContact = new Contact(data);
  return await newContact.save();
};

export const updateContactById = async (contactId, updateData) => {
  return Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteContactById = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
