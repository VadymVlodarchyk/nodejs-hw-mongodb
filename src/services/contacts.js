import { Contact } from '../models/contactModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPhotoToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'contacts',
  });
  return result.secure_url;
};

export const getAllContacts = async (userId, filter = {}, options = {}) => {
  return Contact.find({ userId, ...filter }, null, options);
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const addContact = async (data, file) => {
  if (file) {
    const photoUrl = await uploadPhotoToCloudinary(file.path);
    data.photo = photoUrl;
  }

  const newContact = new Contact(data);
  return await newContact.save();
};

export const updateContactById = async (contactId, userId, updateData, file) => {
  if (file) {
    const photoUrl = await uploadPhotoToCloudinary(file.path);
    updateData.photo = photoUrl;
  }

  return Contact.findOneAndUpdate({ _id: contactId, userId }, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteContactById = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
