import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { starterQuestions } from './questions.js';

const defaultDatabasePath = path.resolve('server/data/techprep.sqlite');

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY,
      category TEXT NOT NULL CHECK (category IN ('OOP', 'DSA', 'OS', 'Networks', 'DBMS')),
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
      question TEXT NOT NULL,
      model_answer TEXT NOT NULL,
      accepted_keywords TEXT NOT NULL,
      demo TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      total_questions INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      score_percent INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quiz_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
      question_id INTEGER NOT NULL REFERENCES questions(id),
      category TEXT NOT NULL,
      answer TEXT NOT NULL,
      score_percent INTEGER NOT NULL,
      is_correct INTEGER NOT NULL CHECK (is_correct IN (0, 1))
    );

    CREATE INDEX IF NOT EXISTS quiz_responses_attempt_id_idx
      ON quiz_responses(attempt_id);
    CREATE INDEX IF NOT EXISTS quiz_responses_question_id_idx
      ON quiz_responses(question_id);
  `);
}

export function seedQuestions(db) {
  const insertQuestion = db.prepare(`
    INSERT OR IGNORE INTO questions (
      id, category, topic, difficulty, question, model_answer, accepted_keywords, demo
    ) VALUES (
      @id, @category, @topic, @difficulty, @question, @modelAnswer,
      @acceptedKeywords, @demo
    )
  `);

  const insertAll = db.transaction((questions) => {
    for (const question of questions) {
      insertQuestion.run({
        ...question,
        acceptedKeywords: JSON.stringify(question.acceptedKeywords),
        demo: JSON.stringify(question.demo)
      });
    }
  });

  insertAll(starterQuestions);
}

export function createDatabase(databasePath = process.env.DB_PATH || defaultDatabasePath) {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true });
  }

  const db = new Database(databasePath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  createSchema(db);
  seedQuestions(db);
  return db;
}