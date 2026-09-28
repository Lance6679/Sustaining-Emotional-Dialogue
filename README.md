# TechPrep

TechPrep is a technical interview practice app built with React, Node.js, Express, and SQLite. It combines a question bank, timed practice, flashcards, progress tracking, and interactive concept demos.

## Setup and run

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

Open `http://localhost:5173` for the app. The development command starts Vite and the Express API together; the client proxies `/api` requests to the API at `http://localhost:3000`. On the first start, TechPrep creates `server/data/techprep.sqlite` and inserts the 10 starter questions. The database file is local and ignored by git.

Useful commands: `npm run dev:api` starts just the API, `npm run dev:web` starts just Vite, `npm run build` creates the production frontend assets, `npm start` starts the API, and `npm test` runs the backend API tests. When running the frontend separately, the API must be available on port 3000.

Set `PORT` to change the API port, `DB_PATH` to choose a different SQLite file, or `API_URL` to point Vite's `/api` proxy at another API server. For example, `DB_PATH=:memory:` uses a temporary database for a single server process.

## Backend structure

```text
TechPrep/
|-- README.md
|-- package.json
|-- package-lock.json
|-- .gitignore
|-- client/
|   |-- index.html
|   |-- vite.config.js
|   `-- src/
|       |-- App.jsx            # Navigation, dashboard, loading, and quiz state
|       |-- DemoLab.jsx        # The 10 interactive concept demonstrations
|       |-- LearningViews.jsx  # Question bank, cards, quizzes, and progress
|       |-- api.js             # Fetch wrapper for the Express API
|       |-- constants.js       # Shared topic categories
|       |-- main.jsx           # React entry point
|       `-- styles.css         # Responsive app styles
`-- server/
		|-- data/                 # Created automatically for the SQLite database
		|-- src/
		|   |-- app.js            # Express app and error handling
		|   |-- index.js          # Server startup and shutdown
		|   |-- db/
		|   |   |-- database.js   # Schema and database connection
		|   |   `-- questions.js  # Starter question bank and demo metadata
		|   `-- routes/
		|       |-- questions.js  # Question listing, filters, and detail
		|       `-- quiz.js       # Quiz scoring and learning progress
		`-- test/
				`-- api.test.js       # HTTP-level API tests
```

## API

All responses use JSON. Question categories are `OOP`, `DSA`, `OS`, `Networks`, and `DBMS`.

### `GET /questions`

Returns the question bank. Optional query parameters: `category`, `difficulty`, and `search` (matches the topic or question text).

```sh
curl 'http://localhost:3000/questions?category=DSA'
```

Each question includes its model answer and `demo` metadata for the interactive exercise the frontend will render.

### `GET /questions/:id`

Returns one question, or `404` if its ID does not exist.

### `POST /quiz/submit`

Submit a list of question IDs and free-text answers. Answers are scored against each question's learning keywords; partial matches earn partial credit. A response includes per-question feedback and model answers.

```sh
curl -X POST http://localhost:3000/quiz/submit \
	-H 'Content-Type: application/json' \
	-d '{"answers":[{"questionId":1,"answer":"Encapsulation, abstraction, inheritance, and polymorphism"}]}'
```

### `GET /progress`

Returns overall quiz totals and accuracy per category. A practiced category below 70% accuracy is reported as a weak topic; categories with no submitted answers are reported separately as unpracticed.

### `GET /health`

Returns a small service health response.

## Seeded topics

| Category | Topics |
| --- | --- |
| OOP | Four OOP pillars; abstract class vs. interface |
| DSA | Array vs. linked list; hash tables; two-sum |
| OS | Process vs. thread; deadlock |
| Networks | TCP vs. UDP; URL-to-page-load flow |
| DBMS | Database normalization to 3NF |

The question bank has category and text filters. Quiz mode runs a timed five-question session with scored feedback; mock interview shuffles all 10 questions into a 15-minute round. Flashcards reveal model answers on flip, and progress highlights practiced topics below 70% accuracy. Each topic has a hands-on demo, including hash collisions, two-thread deadlock, the TCP handshake, and normalization from an unnormalized table to 3NF.