import multer from 'multer';
import path from 'path';
import os from 'os';

// Тимчасове сховище для зображень у системній папці
const tempDir = path.join(os.tmpdir(), 'uploads');

// Конфігурація сховища
const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Фільтр лише для зображень
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Ініціалізація Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // максимум 5MB
  },
});
