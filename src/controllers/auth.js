import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configs from "../configs/index.js";
import createError from "http-errors";

const x = {};
const db = [];

x.login = (req, res, next) => {
  const { username, password } = req.body;

  const id = db.findIndex(item => item.username === username);

  const error = createError(422, "Invalid username and password combination");

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

  if (exist) return next(createError(422, "Username already exists!"));

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

export default x;
