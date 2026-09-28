import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`TechPrep API listening at http://localhost:${port}`);
});

function shutDown() {
  server.close(() => {
    app.locals.database.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);