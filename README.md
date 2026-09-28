# TechPrep

TechPrep is a technical interview practice app. This first project stage contains the Express and SQLite backend; the React frontend will be added in the next stage.

## Backend setup

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

The API starts at `http://localhost:3000`. On the first start, TechPrep creates `server/data/techprep.sqlite` and inserts the 10 starter questions. The database file is local and ignored by git.

For a normal start, run `npm start`. Run the backend tests with `npm test`.

Set `PORT` to change the listening port, or `DB_PATH` to choose a different SQLite file. For example, `DB_PATH=:memory:` uses a temporary database for a single server process.

## Backend structure

```text
TechPrep/
|-- README.md
|-- package.json
|-- .gitignore
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

The question records include demo descriptors for all 10 topics, including a hash collision visualizer, two-thread/two-lock deadlock simulation, TCP handshake, and a normalization example. The React interface and actual browser-based demos are the next stage.