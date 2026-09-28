import cors from 'cors';
import express from 'express';
import { createDatabase } from './db/database.js';
import { createQuestionsRouter } from './routes/questions.js';
import { createQuizRouter } from './routes/quiz.js';

export function createApp({ database = createDatabase() } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json({ limit: '32kb' }));
  app.locals.database = database;

  app.get('/health', (_req, res) => res.json({ status: 'ok', name: 'TechPrep API' }));
  app.use('/questions', createQuestionsRouter(database));
  app.use('/', createQuizRouter(database));

  app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

  app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError && 'body' in error) {
      return res.status(400).json({ error: 'Request body must be valid JSON.' });
    }
    console.error(error);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  });

  return app;
}