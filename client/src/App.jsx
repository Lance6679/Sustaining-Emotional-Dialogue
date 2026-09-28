import { useEffect, useRef, useState } from 'react';
import {
  Activity, BarChart3, BookOpen, BrainCircuit, ChevronRight, CircleHelp,
  Code2, Database, Layers3, Network, Search, ServerCog, Timer, Trophy,
  Workflow, Zap
} from 'lucide-react';
import { getProgress, getQuestions, submitQuiz } from './api.js';
import { categories } from './constants.js';
import {
  Flashcards, ProgressView, QuestionBank, QuizResults, QuizSession, QuizSetup
} from './LearningViews.jsx';

const navigation = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'bank', label: 'Question bank', icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: Layers3 },
  { id: 'quiz', label: 'Quiz mode', icon: Timer },
  { id: 'mock', label: 'Mock interview', icon: BrainCircuit },
  { id: 'progress', label: 'Progress', icon: Activity }
];

const categoryIcons = {
  OOP: Code2,
  DSA: Workflow,
  OS: ServerCog,
  Networks: Network,
  DBMS: Database
};

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function Sidebar({ activeView, onNavigate, activeCategory, onCategoryChange, questionCount }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#overview" onClick={() => onNavigate('overview')}>
        <span className="brand-mark"><Zap size={19} fill="currentColor" /></span>
        <span className="brand-name">techprep<span className="brand-period">.</span></span>
      </a>
      <div className="sidebar-label">Workspace</div>
      <nav className="main-navigation" aria-label="Main navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            className={`nav-link ${activeView === id ? 'is-active' : ''}`}
            key={id}
            onClick={() => onNavigate(id)}
            type="button"
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
            {id === 'bank' && <span className="nav-count">{questionCount}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />
      <div className="sidebar-label">Study by topic</div>
      <nav className="topic-navigation" aria-label="Filter question bank by topic">
        <button
          className={`topic-link ${activeCategory === 'All' ? 'is-selected' : ''}`}
          onClick={() => { onCategoryChange('All'); onNavigate('bank'); }}
          type="button"
        >
          <CircleHelp size={16} /><span>All topics</span>
        </button>
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          return (
            <button
              className={`topic-link ${activeCategory === category ? 'is-selected' : ''}`}
              key={category}
              onClick={() => { onCategoryChange(category); onNavigate('bank'); }}
              type="button"
            >
              <Icon size={16} /><span>{category}</span>
              <span className={`topic-dot topic-${category.toLowerCase()}`} />
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="streak-note">
          <span className="streak-icon"><Trophy size={16} /></span>
          <div><strong>Small steps count</strong><span>One good answer at a time.</span></div>
        </div>
        <div className="profile-row">
          <span className="profile-avatar">TP</span>
          <span className="profile-name">Interview prep</span>
          <span className="profile-status" title="Local practice profile" />
        </div>
      </div>
    </aside>
  );
}

function Dashboard({ questions, progress, onNavigate, onStartSession, onChooseCategory }) {
  const totals = progress?.totals ?? {};
  const weakTopics = progress?.weakTopics ?? [];
  const practiced = progress?.topics?.filter((topic) => topic.answersSubmitted > 0).length ?? 0;

  return (
    <div className="dashboard-view page-enter">
      <section className="welcome-band">
        <div className="welcome-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> YOUR PRACTICE SPACE</p>
          <h2>Think clearly.<br /><span>Answer confidently.</span></h2>
          <p className="welcome-description">Build interview fluency one concept at a time. Your next session is ready when you are.</p>
          <div className="welcome-actions">
            <button className="button button-accent" onClick={() => onStartSession('quiz')} type="button">
              <Zap size={16} fill="currentColor" /> Start a quick quiz
            </button>
            <button className="button button-quiet" onClick={() => onNavigate('bank')} type="button">
              Browse questions <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="orbit orbit-outer" /><div className="orbit orbit-middle" />
          <div className="orbit-core"><Code2 size={25} /></div>
          <span className="orbit-tag orbit-tag-one">define()</span>
          <span className="orbit-tag orbit-tag-two">while(true)</span>
          <span className="orbit-tag orbit-tag-three">return 42</span>
          <span className="orbit-spark orbit-spark-one">✳</span>
          <span className="orbit-spark orbit-spark-two">+</span>
        </div>
        <div className="welcome-footnote"><span className="live-dot" /> BUILT FOR DEEP WORK</div>
      </section>

      <section className="stats-grid" aria-label="Practice summary">
        <article className="stat-block">
          <span className="stat-icon stat-icon-lime"><BookOpen size={18} /></span>
          <span className="stat-value">{questions.length.toString().padStart(2, '0')}</span>
          <span className="stat-label">Questions to explore</span>
          <span className="stat-caption">across 5 core areas</span>
        </article>
        <article className="stat-block">
          <span className="stat-icon stat-icon-peach"><Trophy size={18} /></span>
          <span className="stat-value">{totals.averageScorePercent ?? 0}<small>%</small></span>
          <span className="stat-label">Average score</span>
          <span className="stat-caption">across {totals.quizCount ?? 0} sessions</span>
        </article>
        <article className="stat-block">
          <span className="stat-icon stat-icon-mint"><Activity size={18} /></span>
          <span className="stat-value">{practiced}<small>/5</small></span>
          <span className="stat-label">Areas practiced</span>
          <span className="stat-caption">keep your coverage balanced</span>
        </article>
        <article className="stat-block stat-block-last">
          <span className="stat-icon stat-icon-lilac"><BrainCircuit size={18} /></span>
          <span className="stat-value">{weakTopics.length.toString().padStart(2, '0')}</span>
          <span className="stat-label">Focus areas</span>
          <span className="stat-caption">topics below 70% accuracy</span>
        </article>
      </section>

      <section className="dashboard-lower">
        <div className="section-column">
          <div className="section-heading">
            <div><p className="eyebrow">PICK UP A THREAD</p><h3>Choose a practice mode</h3></div>
            <button className="text-link" onClick={() => onNavigate('progress')} type="button">View progress <ChevronRight size={15} /></button>
          </div>
          <div className="mode-list">
            <button className="mode-row" onClick={() => onStartSession('quiz')} type="button">
              <span className="mode-number">01</span><span className="mode-icon mode-icon-orange"><Timer size={18} /></span>
              <span className="mode-copy"><strong>Quick quiz</strong><small>5 questions · 10 minutes</small></span><ChevronRight className="mode-arrow" size={17} />
            </button>
            <button className="mode-row" onClick={() => onStartSession('mock')} type="button">
              <span className="mode-number">02</span><span className="mode-icon mode-icon-purple"><BrainCircuit size={18} /></span>
              <span className="mode-copy"><strong>Mock interview</strong><small>10 questions · timed session</small></span><ChevronRight className="mode-arrow" size={17} />
            </button>
            <button className="mode-row" onClick={() => onNavigate('flashcards')} type="button">
              <span className="mode-number">03</span><span className="mode-icon mode-icon-green"><Layers3 size={18} /></span>
              <span className="mode-copy"><strong>Flashcards</strong><small>Recall a concept, then reveal</small></span><ChevronRight className="mode-arrow" size={17} />
            </button>
          </div>
        </div>

        <aside className="coverage-panel">
          <div className="coverage-heading"><span className="coverage-kicker">YOUR MAP</span><span className="coverage-total">{practiced} of 5</span></div>
          <h3>Topic coverage</h3>
          <p>Practice a little across every area to spot where you want to go deeper.</p>
          <div className="coverage-list">
            {categories.map((category) => {
              const topicProgress = progress?.topics?.find((topic) => topic.category === category);
              const Icon = categoryIcons[category];
              return (
                <button className="coverage-row" key={category} onClick={() => onChooseCategory(category)} type="button">
                  <Icon size={15} className={`coverage-icon coverage-${category.toLowerCase()}`} />
                  <span className="coverage-name">{category}</span>
                  {topicProgress?.answersSubmitted ? <span className="coverage-score">{topicProgress.accuracyPercent}%</span> : <span className="coverage-unseen">Not yet</span>}
                  <ChevronRight size={14} className="coverage-chevron" />
                </button>
              );
            })}
          </div>
          <button className="coverage-link" onClick={() => onNavigate('progress')} type="button">See your progress <ChevronRight size={15} /></button>
        </aside>
      </section>
    </div>
  );
}

function LoadingState({ error, onRetry }) {
  return (
    <main className="loading-state" role={error ? 'alert' : 'status'}>
      <span className="loading-mark"><Zap size={18} /></span>
      <h2>{error ? 'Could not reach the practice API' : 'Loading your question bank'}</h2>
      <p>{error || 'Connecting to your local TechPrep server…'}</p>
      {error && <button className="button button-dark" onClick={onRetry} type="button">Try again</button>}
    </main>
  );
}

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [currentView, setCurrentView] = useState('overview');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [requestedMode, setRequestedMode] = useState('quiz');
  const [session, setSession] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizIndex, setQuizIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [quizError, setQuizError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError('');
    Promise.all([getQuestions(), getProgress()])
      .then(([questionData, progressData]) => {
        if (cancelled) return;
        setQuestions(questionData);
        setProgress(progressData);
        setSelectedQuestionId((selectedId) => selectedId ?? questionData[0]?.id ?? null);
      })
      .catch((error) => { if (!cancelled) setLoadError(error.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  useEffect(() => {
    if (currentView !== 'quiz' || !session || quizResult || isSubmitting) return undefined;
    const timerId = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [currentView, session, quizResult, isSubmitting]);

  const filteredQuestions = questions.filter((question) => {
    const matchesCategory = activeCategory === 'All' || question.category === activeCategory;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${question.topic} ${question.question}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  const selectedQuestion = filteredQuestions.find((question) => question.id === selectedQuestionId) ?? filteredQuestions[0];
  const activeNavigation = currentView === 'quiz' ? requestedMode : currentView;

  function navigate(view) {
    if (view === 'quiz' || view === 'mock') {
      setSession(null);
      setQuizResult(null);
      setQuizError('');
      setCurrentView('quiz');
      setRequestedMode(view);
      return;
    }
    setCurrentView(view);
  }

  function chooseCategory(category) {
    setActiveCategory(category);
    setSearch('');
    setCurrentView('bank');
  }

  function startSession(mode) {
    const pool = mode === 'mock' || activeCategory === 'All'
      ? questions
      : questions.filter((question) => question.category === activeCategory);
    const selectedQuestions = shuffle(pool).slice(0, mode === 'mock' ? 10 : 5);
    if (selectedQuestions.length === 0) return;
    submittedRef.current = false;
    setSession({ mode, questions: selectedQuestions });
    setQuizAnswers({});
    setQuizIndex(0);
    setQuizResult(null);
    setQuizError('');
    setIsSubmitting(false);
    setRemainingSeconds(mode === 'mock' ? 15 * 60 : 10 * 60);
    setCurrentView('quiz');
    setRequestedMode(mode);
  }

  async function finishSession() {
    if (!session || submittedRef.current || isSubmitting) return;
    submittedRef.current = true;
    setIsSubmitting(true);
    setQuizError('');
    try {
      const result = await submitQuiz(session.questions.map((question) => ({
        questionId: question.id,
        answer: quizAnswers[question.id] ?? ''
      })));
      setQuizResult(result);
      getProgress().then(setProgress).catch(() => {});
    } catch (error) {
      setQuizError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (session && remainingSeconds === 0 && !quizResult && !isSubmitting) finishSession();
  }, [remainingSeconds, session, quizResult, isSubmitting]);

  const pageLabels = {
    overview: 'Overview', bank: 'Question bank', flashcards: 'Flashcards',
    quiz: requestedMode === 'mock' ? 'Mock interview' : 'Quiz mode', progress: 'Progress'
  };

  if (isLoading || loadError) {
    return <LoadingState error={loadError} onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeNavigation}
        onNavigate={navigate}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        questionCount={questions.length}
      />
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>TECHPREP</span><span className="breadcrumb-slash">/</span><strong>{pageLabels[currentView]}</strong></div>
          <div className="topbar-tools">
            <label className="global-search">
              <Search size={15} />
              <input
                aria-label="Search questions"
                disabled={Boolean(session && currentView === 'quiz' && !quizResult)}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => { if (!session) setCurrentView('bank'); }}
                placeholder={session && currentView === 'quiz' ? 'Interview in progress' : 'Find a concept...'}
                value={search}
              />
              <kbd>/</kbd>
            </label>
            <span className="api-status"><span className="live-dot" /> API connected</span>
          </div>
        </header>
        <main className="main-content">
          {currentView === 'overview' && <Dashboard questions={questions} progress={progress} onNavigate={navigate} onStartSession={startSession} onChooseCategory={chooseCategory} />}
          {currentView === 'bank' && (
            <QuestionBank
              questions={filteredQuestions}
              selectedQuestion={selectedQuestion}
              activeCategory={activeCategory}
              search={search}
              onSearchChange={setSearch}
              onCategoryChange={setActiveCategory}
              onSelectQuestion={setSelectedQuestionId}
            />
          )}
          {currentView === 'flashcards' && <Flashcards questions={filteredQuestions} />}
          {currentView === 'quiz' && (quizResult ? (
            <QuizResults result={quizResult} mode={session?.mode ?? requestedMode} onRetry={() => startSession(session?.mode ?? requestedMode)} onReview={() => { setCurrentView('bank'); setActiveCategory('All'); }} />
          ) : session ? (
            <QuizSession
              session={session}
              answers={quizAnswers}
              currentIndex={quizIndex}
              remainingSeconds={remainingSeconds}
              isSubmitting={isSubmitting}
              error={quizError}
              onAnswerChange={(questionId, answer) => setQuizAnswers((current) => ({ ...current, [questionId]: answer }))}
              onIndexChange={setQuizIndex}
              onSubmit={finishSession}
              onRetrySubmit={() => { submittedRef.current = false; finishSession(); }}
            />
          ) : <QuizSetup mode={requestedMode} questionCount={questions.length} onStart={() => startSession(requestedMode)} />)}
          {currentView === 'progress' && <ProgressView progress={progress} onPractice={chooseCategory} />}
        </main>
        <footer className="workspace-footer">
          <span>TECHPREP <span className="footer-separator">/</span> PRACTICE WITH PURPOSE</span>
          <span>{questions.length} curated questions <span className="footer-separator">·</span> 5 topic areas</span>
        </footer>
      </div>
      <nav className="mobile-navigation" aria-label="Mobile navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            aria-label={label}
            className={activeNavigation === id ? 'is-active' : ''}
            key={id}
            onClick={() => navigate(id)}
            title={label}
            type="button"
          >
            <Icon size={18} /><span>{label.replace(' mode', '')}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}