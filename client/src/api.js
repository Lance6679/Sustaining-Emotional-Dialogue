const apiBase = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}.`);
  }
  return data;
}

export async function getQuestions() {
  const data = await request('/questions');
  return data.questions;
}

export async function getProgress() {
  return request('/progress');
}

export async function submitQuiz(answers) {
  return request('/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
}