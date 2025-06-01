import { Contact } from '../models/contactModel.js';

export const getAllContacts = async (userId, filter = {}, options = {}) => {
  return Contact.find({ userId, ...filter }, null, options);
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const addContact = async (data) => {
  const newContact = new Contact(data);
  return await newContact.save();
};

export const updateContactById = async (contactId, userId, updateData) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteContactById = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
