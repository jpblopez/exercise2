import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from '../configs/index.js';
import createError from 'http-errors';
import jwt_decode from 'jwt-decode';

const x = {};
const db = [
  {
    id: 0,
    username: 'test',
    password: '$2b$10$T.XHy/l/NxrwxChD0NMvIuZ6LxIN.IVz4zvlfJlZTbPJhYWaRszZC',
    name: 'test',
  },
];
const tweets = [];
let currentUserTweets = [];

x.login = (req, res, next) => {
  const { username, password } = req.body;

  const id = db.findIndex(item => item.username === username);

  const error = createError(422, 'Invalid username and password combination');

  if (id < 0) return next(error);

  const comparePass = db[id].password;

  const valid = bcrypt.compareSync(password, comparePass);

  if (!valid) return next(error);

  const token = jwt.sign(
    {
      username,
      id,
    },
    configs.secret,
    {
      expiresIn: 60 * 60 * 3,
    }
  );

  res.status(200).json({
    token,
  });
};

x.register = (req, res, next) => {
  const { username, password, name } = req.body;

  const exist = db.find(item => item.username === username);

  if (exist) return next(createError(422, 'Username already exists!'));

  let lastID;

  if (db.length == 0) lastID = 0;
  else lastID = Math.max(...db.map(item => item.id)) + 1;

  const hash = bcrypt.hashSync(password, 10);

  db.push({
    id: lastID,
    username,
    password: hash,
    name,
  });

  res.sendStatus(200);
};

x.get = (req, res) => {
  res.status(200).json({
    users: db,
  });
};

x.postTweet = (req, res) => {
  const tweet = req.body;
  const test = jwt_decode(req.headers.authorization);
  const index = tweets.findIndex(({ id }) => id === test.id);

  if (index < 0) {
    tweets.push({
      id: test.id,
      tweet: [tweet],
    });
  } else {
    tweets[index].tweet.push(tweet);
  }

  res.status(200).json({
    tweets: tweet,
  });
};

x.tweet = (req, res) => {
  const token = jwt_decode(req.headers.authorization);
  let userTweet = tweets.find(({ id }) => id === token.id);
  currentUserTweets = [];

  if (!userTweet) {
    res.status(200).send({ tweets: [] });
    return;
  }

  userTweet.tweet.map(c => {
    currentUserTweets.push(c.tweet);
  });

  res.status(200).send(currentUserTweets);
};

export default x;
