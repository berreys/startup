const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

var currentUsername = 'unchanged';

apiRouter.get('/username', (_req, res) => {
  const response = {username: currentUsername};
  res.send(response);
});

apiRouter.post('/username', (req, res) => {
  currentUsername = req.body.username;
  res.send(currentUsername);
});

var groups = [];

apiRouter.get('/groups', (_req, res) => {
  const response = {groups: groups};
  res.send(response);
});

apiRouter.post('/groups', (req, res) => {
  groups = JSON.parse(req.body.groups);
  console.log(groups);
  res.send(groups);
});

var debts = [];

apiRouter.get('/debts', (_req, res) => {
  const response = {debts: debts};
  res.send(response);
});

apiRouter.post('/debts', (req, res) => {
  debts = JSON.parse(req.body.debts);
  console.log(debts);
  res.send(debts);
});