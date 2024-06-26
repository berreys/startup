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

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });

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

apiRouter.post('/groups', async (req, res) => {
  groups = JSON.parse(req.body.groups);
  console.log(groups);
  res.send(groups);
  for(var i = 0; i < groups.length; i++){
    await addGroup(groups[i]);
  }
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

//mongodb functions

const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const config = require('./dbConfig.json');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const authCookieName = 'token';

const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const groupCollection = db.collection('group');

//returns user given their username
function getUser(username){
  return userCollection.findOne({username: username});
}
//returns the user based on a token
function getUserByToken(token){
  return userCollection.findOne({token: token});
}
//creates a user in the mongodb database
async function createUser(username, password){
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4()
  };
  await userCollection.insertOne(user);
  return user;
}
//first deletes the old version of the group in the database, then adds the new information
async function addGroup(group){
  await groupCollection.deleteMany({id: group.id});
  await groupCollection.insertOne(group);
}
//returns all groups in the group collection
function getGroups(){
  const cursor = groupCollection.find();
  return cursor.toArray()
}

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});
//login
apiRouter.post('/auth/login', async (req, res) => {
  const user = await getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});



//endpoint to get all the groups in the database
apiRouter.get('/getGroups', async (req, res) => {
  const groups = await getGroups();
  res.send(groups);
})
//adds a single group to the database
apiRouter.post('/addGroup', async (req, res) => {
  const group = {...req.body, ip:req.ip};
  await addGroup(group);
  const groups = await getGroups();
  res.send(groups);
})


//sets the users cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}


//WEBSOCKET CODE
const { peerProxy } = require('./peerProxy.js');

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);