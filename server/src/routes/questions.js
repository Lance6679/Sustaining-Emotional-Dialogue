import { Router } from 'express';
import { categories } from '../db/questions.js';

function toQuestion(row) {
  return {
    id: row.id,
    category: row.category,
    topic: row.topic,
    difficulty: row.difficulty,
    question: row.question,
    modelAnswer: row.model_answer,
    acceptedKeywords: JSON.parse(row.accepted_keywords),
    demo: JSON.parse(row.demo)
  };
}

export function createQuestionsRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    const filters = [];
    const values = [];

    if (req.query.category) {
      const category = String(req.query.category).toUpperCase();
      if (!categories.includes(category)) {
        return res.status(400).json({
          error: 'Invalid category.',
          allowedCategories: categories
        });
      }
      filters.push('category = ?');
      values.push(category);
    }

    if (req.query.difficulty) {
      const difficulty = String(req.query.difficulty).toLowerCase();
      const allowedDifficulties = ['beginner', 'intermediate', 'advanced'];
      if (!allowedDifficulties.includes(difficulty)) {
        return res.status(400).json({
          error: 'Invalid difficulty.',
          allowedDifficulties: ['Beginner', 'Intermediate', 'Advanced']
        });
      }
      filters.push('difficulty = ?');
      values.push(difficulty[0].toUpperCase() + difficulty.slice(1));
    }

    if (req.query.search) {
      filters.push('(topic LIKE ? COLLATE NOCASE OR question LIKE ? COLLATE NOCASE)');
      const search = `%${String(req.query.search).slice(0, 100)}%`;
      values.push(search, search);
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const rows = db.prepare(`SELECT * FROM questions ${where} ORDER BY id`).all(...values);
    return res.json({ count: rows.length, questions: rows.map(toQuestion) });
  });

  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Question ID must be a positive integer.' });
    }

    const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    return res.json({ question: toQuestion(row) });
  });

  return router;
}