import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

console.log('✅ Registering /contacts route');

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Основний маршрут для перевірки доступності
  app.get('/', (req, res) => {
    res.status(200).send('✅ Everything is working perfectly!');
  });

  // Роут для контактів
  app.use('/contacts', contactsRouter);

  // Обробка 404 після всіх маршрутів
  app.use(notFoundHandler);

  // Обробка помилок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
