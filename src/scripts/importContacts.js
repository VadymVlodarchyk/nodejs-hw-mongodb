import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { Contact } from '../models/contactModel.js';

dotenv.config();

const contactsRaw = await readFile(
  new URL('../data/contacts.json', import.meta.url),
  'utf-8'
);
const contacts = JSON.parse(contactsRaw);

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

const importContacts = async () => {
  try {
    await mongoose.connect(uri);
    await Contact.deleteMany(); 
    await Contact.insertMany(contacts); 
    console.log('Contacts imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing contacts:', error.message);
    process.exit(1);
  }
};

importContacts();
