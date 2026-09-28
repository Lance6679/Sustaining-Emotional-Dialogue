import { Router } from 'express';

const correctAnswerThreshold = 60;

function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scoreAnswer(answer, acceptedKeywords) {
  const normalizedAnswer = normalizeText(answer);
  const matchedKeywords = acceptedKeywords.filter((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    return normalizedKeyword.length > 0 && normalizedAnswer.includes(normalizedKeyword);
  });

  const scorePercent = acceptedKeywords.length === 0
    ? 0
    : Math.round((matchedKeywords.length / acceptedKeywords.length) * 100);

  return {
    scorePercent,
    isCorrect: scorePercent >= correctAnswerThreshold,
    matchedKeywords,
    missingKeywords: acceptedKeywords.filter((keyword) => !matchedKeywords.includes(keyword))
  };
}

export function createQuizRouter(db) {
  const router = Router();

  router.post('/quiz/submit', (req, res) => {
    const { answers } = req.body ?? {};
    if (!Array.isArray(answers) || answers.length === 0 || answers.length > 50) {
      return res.status(400).json({
        error: 'Submit between 1 and 50 answers in an answers array.'
      });
    }

    const seenQuestionIds = new Set();
    for (const entry of answers) {
      if (!entry || !Number.isInteger(entry.questionId) || entry.questionId < 1) {
        return res.status(400).json({ error: 'Each answer needs a positive integer questionId.' });
      }
      if (seenQuestionIds.has(entry.questionId)) {
        return res.status(400).json({ error: 'A question can only appear once per quiz.' });
      }
      if (typeof entry.answer !== 'string' || entry.answer.length > 5000) {
        return res.status(400).json({ error: 'Each answer must be text of at most 5000 characters.' });
      }
      seenQuestionIds.add(entry.questionId);
    }

    const placeholders = answers.map(() => '?').join(', ');
    const questionRows = db.prepare(
      `SELECT * FROM questions WHERE id IN (${placeholders})`
    ).all(...answers.map((entry) => entry.questionId));
    const questionsById = new Map(questionRows.map((question) => [question.id, question]));

    if (questionsById.size !== answers.length) {
      return res.status(400).json({ error: 'One or more question IDs do not exist.' });
    }

    const results = answers.map(({ questionId, answer }) => {
      const question = questionsById.get(questionId);
      const acceptedKeywords = JSON.parse(question.accepted_keywords);
      const score = scoreAnswer(answer, acceptedKeywords);

      return {
        questionId,
        topic: question.topic,
        category: question.category,
        answer,
        ...score,
        modelAnswer: question.model_answer
      };
    });

    const scorePercent = Math.round(
      results.reduce((total, result) => total + result.scorePercent, 0) / results.length
    );
    const correctAnswers = results.filter((result) => result.isCorrect).length;

    const saveAttempt = db.transaction(() => {
      const attempt = db.prepare(`
        INSERT INTO quiz_attempts (total_questions, correct_answers, score_percent)
        VALUES (?, ?, ?)
      `).run(results.length, correctAnswers, scorePercent);

      const insertResponse = db.prepare(`
        INSERT INTO quiz_responses (
          attempt_id, question_id, category, answer, score_percent, is_correct
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const result of results) {
        insertResponse.run(
          attempt.lastInsertRowid,
          result.questionId,
          result.category,
          result.answer,
          result.scorePercent,
          Number(result.isCorrect)
        );
      }

      return Number(attempt.lastInsertRowid);
    });

    const attemptId = saveAttempt();
    return res.status(201).json({
      attemptId,
      totalQuestions: results.length,
      correctAnswers,
      scorePercent,
      results
    });
  });

  router.get('/progress', (_req, res) => {
    const topics = db.prepare(`
      SELECT
        q.category,
        COUNT(DISTINCT q.id) AS questionCount,
        COUNT(r.id) AS answersSubmitted,
        COUNT(DISTINCT r.question_id) AS distinctQuestionsAttempted,
        COUNT(DISTINCT r.attempt_id) AS quizCount,
        COALESCE(ROUND(AVG(r.score_percent)), 0) AS accuracyPercent
      FROM questions q
      LEFT JOIN quiz_responses r ON r.question_id = q.id
      GROUP BY q.category
      ORDER BY q.category
    `).all();

    const totals = db.prepare(`
      SELECT
        COUNT(*) AS quizCount,
        COALESCE(SUM(total_questions), 0) AS answersSubmitted,
        COALESCE(SUM(correct_answers), 0) AS correctAnswers,
        COALESCE(ROUND(AVG(score_percent)), 0) AS averageScorePercent
      FROM quiz_attempts
    `).get();

    return res.json({
      totals,
      topics,
      weakTopics: topics.filter((topic) => (
        topic.answersSubmitted > 0 && topic.accuracyPercent < 70
      )),
      unpracticedTopics: topics.filter((topic) => topic.answersSubmitted === 0)
    });
  });

  return router;
}