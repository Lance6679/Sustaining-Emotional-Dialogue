import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight,
  CircleAlert, CircleCheck, Clock3, RotateCcw, Search, ShieldCheck,
  Sparkles, Target, X
} from 'lucide-react';
import { categories } from './constants.js';
import DemoLab from './DemoLab.jsx';

const categoryClass = (category) => `category-${category.toLowerCase()}`;

function PageHeading({ kicker, title, description, action }) {
  return (
    <div className="page-heading">
      <div><p className="eyebrow">{kicker}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>
      {action}
    </div>
  );
}

export function QuestionBank({ questions, selectedQuestion, activeCategory, search, onSearchChange, onCategoryChange, onSelectQuestion }) {
  return (
    <div className="page-enter">
      <PageHeading kicker="THE QUESTION BANK" title="Explore the fundamentals" description="Pick a topic, test your understanding, and open the demo to make each idea concrete." />
      <div className="bank-toolbar">
        <div className="category-tabs" role="group" aria-label="Filter by category">
          {['All', ...categories].map((category) => (
            <button className={activeCategory === category ? 'is-active' : ''} key={category} onClick={() => onCategoryChange(category)} type="button">{category}</button>
          ))}
        </div>
        <label className="bank-search"><Search size={15} /><input aria-label="Filter visible questions" onChange={(event) => onSearchChange(event.target.value)} placeholder="Filter questions" value={search} /></label>
      </div>
      <div className="bank-layout">
        <section className="question-list" aria-label="Questions">
          <div className="list-heading"><span>{questions.length} {questions.length === 1 ? 'question' : 'questions'}</span><span>DIFFICULTY</span></div>
          {questions.map((question, index) => (
            <button
              className={`question-row ${selectedQuestion?.id === question.id ? 'is-selected' : ''}`}
              key={question.id}
              onClick={() => onSelectQuestion(question.id)}
              type="button"
            >
              <span className="question-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="question-row-copy">
                <span className={`category-label ${categoryClass(question.category)}`}>{question.category}</span>
                <strong>{question.topic}</strong>
                <small>{question.question}</small>
              </span>
              <span className={`difficulty difficulty-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
              <ChevronRight className="question-chevron" size={16} />
            </button>
          ))}
          {questions.length === 0 && <div className="empty-list"><Search size={20} /><strong>No matching questions</strong><span>Try a different filter or search.</span></div>}
        </section>

        {selectedQuestion && (
          <aside className="question-detail">
            <div className="detail-topline"><span className={`category-label ${categoryClass(selectedQuestion.category)}`}>{selectedQuestion.category}</span><span>#{String(selectedQuestion.id).padStart(2, '0')}</span></div>
            <h2>{selectedQuestion.topic}</h2>
            <p className="detail-question">{selectedQuestion.question}</p>
            <div className="answer-block">
              <span className="answer-label"><Sparkles size={14} /> MODEL ANSWER</span>
              <p>{selectedQuestion.modelAnswer}</p>
            </div>
            <div className="demo-intro">
              <div className="demo-icon"><Target size={17} /></div>
              <div><strong>{selectedQuestion.demo.title}</strong><p>{selectedQuestion.demo.description}</p></div>
            </div>
            <DemoLab question={selectedQuestion} />
          </aside>
        )}
      </div>
    </div>
  );
}

export function Flashcards({ questions }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const question = questions[index];

  function changeCard(nextIndex) {
    setIndex((nextIndex + questions.length) % questions.length);
    setFlipped(false);
  }

  if (!question) {
    return <div className="empty-state"><Sparkles size={22} /><h2>No cards match that search</h2><p>Clear the search in the top bar to see the full deck.</p></div>;
  }

  return (
    <div className="page-enter flashcard-page">
      <PageHeading kicker="ACTIVE RECALL" title="Flashcards" description="Try to explain the concept out loud before you turn the card over." />
      <div className="flashcard-counter"><span>{String(index + 1).padStart(2, '0')}</span><span className="counter-divider">/</span><span>{String(questions.length).padStart(2, '0')}</span><span className="counter-topic">{question.topic}</span></div>
      <button className={`flashcard ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((current) => !current)} type="button" aria-pressed={flipped}>
        <span className="flashcard-topline"><span className={`category-label ${categoryClass(question.category)}`}>{question.category}</span><span>{flipped ? 'MODEL ANSWER' : 'QUESTION'}</span></span>
        <span className="flashcard-content">{flipped ? question.modelAnswer : question.question}</span>
        <span className="flashcard-bottom"><span className="flashcard-hint"><RotateCcw size={15} /> Click to {flipped ? 'see question' : 'reveal answer'}</span><span className="flashcard-difficulty">{question.difficulty}</span></span>
      </button>
      <div className="flashcard-controls">
        <button className="icon-button" aria-label="Previous flashcard" onClick={() => changeCard(index - 1)} type="button"><ArrowLeft size={18} /></button>
        <div className="flashcard-dots" aria-label={`Card ${index + 1} of ${questions.length}`}>
          {questions.map((item, itemIndex) => <button aria-label={`Go to ${item.topic}`} aria-current={index === itemIndex ? 'step' : undefined} className={index === itemIndex ? 'is-active' : ''} key={item.id} onClick={() => changeCard(itemIndex)} type="button" />)}
        </div>
        <button className="icon-button icon-button-dark" aria-label="Next flashcard" onClick={() => changeCard(index + 1)} type="button"><ArrowRight size={18} /></button>
      </div>
      <p className="flashcard-note">A good answer is one you can explain in your own words.</p>
    </div>
  );
}

export function QuizSetup({ mode, questionCount, onStart }) {
  const isMock = mode === 'mock';
  return (
    <div className="page-enter quiz-setup-page">
      <PageHeading kicker={isMock ? 'SIMULATED INTERVIEW' : 'RETRIEVAL PRACTICE'} title={isMock ? 'Mock interview' : 'Quick quiz'} description={isMock ? 'A full round across all five topic areas. Keep your answers focused and think out loud.' : 'A short timed round to check what you can recall without notes.'} />
      <section className="setup-panel">
        <div className="setup-number" aria-hidden="true">{isMock ? '10' : '05'}</div>
        <div className="setup-copy">
          <span className="setup-tag"><span className="live-dot" /> READY WHEN YOU ARE</span>
          <h2>{isMock ? 'The interview room is yours.' : 'Five questions. One clear head.'}</h2>
          <p>{isMock ? 'Questions are shuffled from the complete bank. You have 15 minutes for your answers.' : 'Questions are shuffled from your selected topic or the complete bank. You have 10 minutes.'}</p>
          <div className="setup-facts"><span><BookOpen size={15} /> {isMock ? questionCount : Math.min(5, questionCount)} questions</span><span><Clock3 size={15} /> {isMock ? '15 minutes' : '10 minutes'}</span><span><Sparkles size={15} /> Instant feedback</span></div>
          <button className="button button-accent" onClick={onStart} type="button"><Zap size={16} fill="currentColor" /> Begin {isMock ? 'mock interview' : 'quiz'}</button>
        </div>
        <div className="setup-decoration" aria-hidden="true"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><i /></div>
      </section>
      <p className="setup-footnote"><ShieldCheck size={15} /> Your progress is saved locally in the TechPrep database.</p>
    </div>
  );
}

export function QuizSession({ session, answers, currentIndex, remainingSeconds, isSubmitting, error, onAnswerChange, onIndexChange, onSubmit, onRetrySubmit }) {
  const question = session.questions[currentIndex];
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
  const answeredCount = session.questions.filter((item) => (answers[item.id] ?? '').trim()).length;

  return (
    <div className="page-enter quiz-session-page">
      <div className="quiz-session-heading">
        <div><p className="eyebrow">{session.mode === 'mock' ? 'MOCK INTERVIEW' : 'QUICK QUIZ'} / QUESTION {String(currentIndex + 1).padStart(2, '0')}</p><h1>Stay curious. Be precise.</h1></div>
        <div className={`quiz-timer ${remainingSeconds < 60 ? 'is-urgent' : ''}`}><Timer size={17} /><span>{minutes}:{seconds}</span></div>
      </div>
      <div className="quiz-progress-line"><span style={{ width: `${((currentIndex + 1) / session.questions.length) * 100}%` }} /></div>
      <div className="quiz-layout">
        <aside className="quiz-question-nav">
          <span className="eyebrow">YOUR QUESTIONS</span>
          {session.questions.map((item, index) => (
            <button className={`quiz-step ${index === currentIndex ? 'is-current' : ''} ${(answers[item.id] ?? '').trim() ? 'is-answered' : ''}`} key={item.id} onClick={() => onIndexChange(index)} type="button">
              <span>{String(index + 1).padStart(2, '0')}</span><small>{item.topic}</small>{(answers[item.id] ?? '').trim() && <Check size={14} />}
            </button>
          ))}
          <div className="quiz-nav-foot"><span>{answeredCount} answered</span><span>{session.questions.length - answeredCount} left blank</span></div>
        </aside>
        <section className="quiz-answer-area">
          <div className="quiz-topic-row"><span className={`category-label ${categoryClass(question.category)}`}>{question.category}</span><span className={`difficulty difficulty-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span></div>
          <h2>{question.question}</h2>
          <label className="answer-input-label" htmlFor="quiz-answer">YOUR RESPONSE <span>Keep it concise; keywords help you review.</span></label>
          <textarea id="quiz-answer" maxLength={5000} onChange={(event) => onAnswerChange(question.id, event.target.value)} placeholder="Structure your answer, then write it in your own words..." value={answers[question.id] ?? ''} />
          <div className="answer-input-footer"><span>{(answers[question.id] ?? '').length} / 5000</span><span>Model answers appear after submission</span></div>
          {error && <div className="inline-error" role="alert"><CircleAlert size={16} /><span>{error}</span><button onClick={onRetrySubmit} type="button">Retry</button></div>}
          <div className="quiz-controls">
            <button className="button button-quiet" disabled={currentIndex === 0} onClick={() => onIndexChange(currentIndex - 1)} type="button"><ChevronLeft size={17} /> Previous</button>
            {currentIndex < session.questions.length - 1 ? (
              <button className="button button-dark" onClick={() => onIndexChange(currentIndex + 1)} type="button">Next question <ChevronRight size={17} /></button>
            ) : (
              <button className="button button-accent" disabled={isSubmitting} onClick={onSubmit} type="button">{isSubmitting ? 'Scoring answers…' : 'Finish & see feedback'} <ArrowRight size={17} /></button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export function QuizResults({ result, mode, onRetry, onReview }) {
  const scoreTone = result.scorePercent >= 70 ? 'score-good' : 'score-review';
  return (
    <div className="page-enter results-page">
      <PageHeading kicker={mode === 'mock' ? 'MOCK INTERVIEW COMPLETE' : 'QUIZ COMPLETE'} title="Here is how it went" description="Review your answers and use the feedback to guide your next round." />
      <section className="results-summary">
        <div className={`score-ring ${scoreTone}`} style={{ '--score': `${result.scorePercent}%` }}><div><strong>{result.scorePercent}<small>%</small></strong><span>overall</span></div></div>
        <div className="results-summary-copy"><span className="setup-tag"><span className="live-dot" /> ATTEMPT #{result.attemptId}</span><h2>{result.correctAnswers} of {result.totalQuestions} answers met the key points</h2><p>Scoring is based on the core ideas in each model answer. Strong interviews explain the reasoning too.</p></div>
        <div className="results-actions"><button className="button button-accent" onClick={onRetry} type="button"><RotateCcw size={16} /> Try another round</button><button className="button button-quiet" onClick={onReview} type="button">Review questions <ArrowRight size={16} /></button></div>
      </section>
      <div className="results-list-heading"><div><p className="eyebrow">QUESTION-BY-QUESTION</p><h3>Your feedback</h3></div><span>{result.totalQuestions} items</span></div>
      <section className="results-list">
        {result.results.map((item, index) => (
          <article className="result-item" key={item.questionId}>
            <div className="result-item-heading"><span className={`result-state ${item.isCorrect ? 'is-correct' : 'needs-review'}`}>{item.isCorrect ? <CircleCheck size={17} /> : <CircleAlert size={17} />}{item.isCorrect ? 'On the mark' : 'Needs review'}</span><span className="result-topic">{String(index + 1).padStart(2, '0')} / {item.topic}</span><span className="result-percent">{item.scorePercent}%</span></div>
            <div className="result-columns"><div><span className="answer-label">YOUR ANSWER</span><p>{item.answer.trim() || 'No answer submitted.'}</p></div><div><span className="answer-label">MODEL ANSWER</span><p>{item.modelAnswer}</p></div></div>
            <div className="keyword-list"><span>Key ideas:</span>{item.matchedKeywords.map((keyword) => <span className="keyword keyword-hit" key={keyword}><Check size={12} />{keyword}</span>)}{item.missingKeywords.map((keyword) => <span className="keyword keyword-missed" key={keyword}><X size={12} />{keyword}</span>)}</div>
          </article>
        ))}
      </section>
    </div>
  );
}

export function ProgressView({ progress, onPractice }) {
  const totals = progress?.totals ?? {};
  return (
    <div className="page-enter progress-page">
      <PageHeading kicker="YOUR LEARNING SIGNALS" title="Progress, not perfection" description="Use your results to choose what to practice next. Accuracy is averaged from every answer you've submitted." />
      <section className="progress-overview">
        <div className="progress-total-card"><span className="progress-card-icon"><Trophy size={19} /></span><span className="eyebrow">AVERAGE SCORE</span><strong>{totals.averageScorePercent ?? 0}<small>%</small></strong><span>{totals.quizCount ?? 0} completed sessions</span></div>
        <div className="progress-total-card"><span className="progress-card-icon progress-card-icon-coral"><Target size={19} /></span><span className="eyebrow">ANSWERS REVIEWED</span><strong>{totals.answersSubmitted ?? 0}</strong><span>Across all practice modes</span></div>
        <div className="progress-total-card"><span className="progress-card-icon progress-card-icon-green"><Check size={19} /></span><span className="eyebrow">KEY POINTS HIT</span><strong>{totals.correctAnswers ?? 0}</strong><span>Answers scoring 60% or more</span></div>
      </section>
      <div className="progress-section-title"><div><p className="eyebrow">FIVE CORE AREAS</p><h3>Topic breakdown</h3></div><span>Weak topics are below 70%</span></div>
      <section className="topic-progress-list">
        {(progress?.topics ?? []).map((topic) => {
          const practiced = topic.answersSubmitted > 0;
          const isWeak = progress.weakTopics.some((weakTopic) => weakTopic.category === topic.category);
          return (
            <article className="topic-progress-row" key={topic.category}>
              <div className="topic-progress-name"><span className={`topic-progress-dot topic-${topic.category.toLowerCase()}`} /><div><strong>{topic.category}</strong><small>{topic.distinctQuestionsAttempted} of {topic.questionCount} questions tried</small></div></div>
              <div className="topic-progress-bar" aria-label={`${topic.category} accuracy ${topic.accuracyPercent}%`}><span className={isWeak ? 'is-weak' : ''} style={{ width: `${practiced ? topic.accuracyPercent : 0}%` }} /></div>
              <span className={`topic-progress-score ${isWeak ? 'is-weak' : ''}`}>{practiced ? `${topic.accuracyPercent}%` : 'Not practiced'}</span>
              <button className="icon-button topic-practice-button" aria-label={`Practice ${topic.category}`} onClick={() => onPractice(topic.category)} title={`Practice ${topic.category}`} type="button"><ChevronRight size={17} /></button>
            </article>
          );
        })}
      </section>
      <div className="progress-legend"><span><i className="legend-dot legend-strong" /> On track</span><span><i className="legend-dot legend-weak" /> Needs practice</span><span><i className="legend-dot legend-none" /> Not started</span></div>
      {(progress?.weakTopics?.length ?? 0) > 0 && <aside className="weak-topic-note"><Sparkles size={17} /><span><strong>Good next step:</strong> try a short practice round in {progress.weakTopics.map((topic) => topic.category).join(', ')}.</span></aside>}
    </div>
  );
}