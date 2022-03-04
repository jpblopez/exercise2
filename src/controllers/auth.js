import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from '../configs/index.js';
import createError from 'http-errors';
import jwt_decode from 'jwt-decode';
import knex from '../db/knex.js';

const x = {};

x.login = async (req, res, next) => {
  const { username, password } = req.body;
  let exist;
  try {
    exist = await knex
      .select()
      .table('user')
      .where('username', username)
      .first();
  } catch (e) {
    return next(e.message);
  }

  const error = createError(422, 'Invalid username and password combination');

  if (!exist) return next(error);

  const valid = bcrypt.compareSync(password, exist.password);

  if (!valid) return next(error);

  const token = jwt.sign(
    {
      username: exist.username,
      id: exist.id,
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

x.register = async (req, res, next) => {
  const { username, password, name } = req.body;
  let exist;
  try {
    exist = await knex
      .select()
      .table('user')
      .where('username', username)
      .first();
  } catch (e) {
    return next(e.message);
  }

  if (exist) return next(createError(422, 'Username already exists!'));

  const hash = bcrypt.hashSync(password, 10);
  try {
    await knex('user').insert({
      username: username,
      name: name,
      password: hash,
    });
  } catch (e) {
    return next(e.message);
  }
  res.sendStatus(200);
};

x.get = (req, res) => {
  res.status(200).json({
    users: db,
  });
};

x.postTweet = async (req, res, next) => {
  const tweet = req.body;
  const token = jwt_decode(req.headers.authorization);

  try {
    await knex('tweets').insert({
      user_id: token.id,
      tweet: tweet.tweet,
    });
  } catch (e) {
    return next(e.message);
  }

  res.status(200).json({
    tweets: tweet,
  });
};

x.tweet = async (req, res, next) => {
  const token = jwt_decode(req.headers.authorization);
  let exist;
  let currentUserTweets = [];

  try {
    exist = await knex
      .select('tweet')
      .table('tweets')
      .where('user_id', token.id);
  } catch (e) {
    console.log(exist);
    return next(e.message);
  }

  if (!exist) {
    res.status(200).send({ tweets: [] });
    return;
  } else
    exist.map(c => {
      currentUserTweets.push(c.tweet);
    });

  // userTweet.tweet.map(c => {
  //   currentUserTweets.push(c.tweet);
  // });

  res.status(200).send(currentUserTweets);
};

export default x;
