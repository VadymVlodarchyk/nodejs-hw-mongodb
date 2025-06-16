import './config/env.js'; // 🔁 ЄДИНИЙ імпорт dotenv
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

console.log('🧪 ENV DIAGNOSTICS:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  CURRENT_DIRECTORY: process.cwd(),
});

const startApp = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('❌ Failed to start the server:', error.message);
    process.exit(1);
  }
};

startApp();
