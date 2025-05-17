import { setupServer } from './src/server.js';
import { initMongoConnection } from './src/db/initMongoConnection.js';

const startApp = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};

startApp();
