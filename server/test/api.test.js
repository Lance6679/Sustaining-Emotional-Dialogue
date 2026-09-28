import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createDatabase } from '../src/db/database.js';

let database;
let app;

before(() => {
  database = createDatabase(':memory:');
  app = createApp({ database });
});

after(() => database.close());

test('health check responds successfully', async () => {
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('question bank is seeded and can be filtered by category', async () => {
  const allQuestions = await request(app).get('/questions');
  const dsaQuestions = await request(app).get('/questions?category=dsa');

  assert.equal(allQuestions.status, 200);
  assert.equal(allQuestions.body.count, 10);
  assert.equal(dsaQuestions.body.count, 3);
  assert.ok(dsaQuestions.body.questions.every((question) => question.category === 'DSA'));
  assert.equal(dsaQuestions.body.questions[0].demo.type, 'array-vs-linked-list');
});

test('question detail returns a question and unknown IDs return 404', async () => {
  const found = await request(app).get('/questions/7');
  const missing = await request(app).get('/questions/999');

  assert.equal(found.status, 200);
  assert.equal(found.body.question.topic, 'Deadlock');
  assert.equal(missing.status, 404);
});

test('quiz submission scores answers and records topic progress', async () => {
  const submission = await request(app)
    .post('/quiz/submit')
    .send({ answers: [{
      questionId: 1,
      answer: 'Encapsulation, abstraction, inheritance, and polymorphism.'
    }] });
  const progress = await request(app).get('/progress');

  assert.equal(submission.status, 201);
  assert.equal(submission.body.scorePercent, 100);
  assert.equal(submission.body.results[0].isCorrect, true);
  assert.equal(progress.status, 200);
  assert.equal(progress.body.totals.quizCount, 1);
  assert.equal(progress.body.totals.correctAnswers, 1);
  assert.equal(progress.body.topics.find((topic) => topic.category === 'OOP').accuracyPercent, 100);
});

test('quiz rejects duplicate question IDs without saving an attempt', async () => {
  const response = await request(app)
    .post('/quiz/submit')
    .send({ answers: [
      { questionId: 1, answer: 'first' },
      { questionId: 1, answer: 'second' }
    ] });
  const progress = await request(app).get('/progress');

  assert.equal(response.status, 400);
  assert.equal(progress.body.totals.quizCount, 1);
});

test('progress separates weak topics from unpracticed topics', async () => {
  await request(app)
    .post('/quiz/submit')
    .send({ answers: [{ questionId: 10, answer: '' }] });
  const progress = await request(app).get('/progress');

  assert.ok(progress.body.weakTopics.some((topic) => topic.category === 'DBMS'));
  assert.ok(progress.body.unpracticedTopics.some((topic) => topic.category === 'Networks'));
});