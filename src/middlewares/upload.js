import { upload } from '../services/cloudinary.js';
export const uploadSingle = upload.single('photo');
