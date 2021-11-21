const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Class = require('./models/class.js');
const Account = require('./models/account.js');
const { generateToken } = require('./utils/jwt.js');
const auth = require('./middlewares/auth.js');

const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const ACCESS_EXP = parseInt(process.env.JWT_ACCESS_TOKEN_EXP);
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
const REFRESH_EXP = parseInt(process.env.JWT_REFRESH_TOKEN_EXP);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(
	`mongodb+srv://${process.env.USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.jqf7i.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
);

mongoose.connection.once('open', async (ref) => {
	console.log('Connected to mongo server!');
});

app.get('/classes', auth, async (req, res) => {
	console.log(res.locals.account);
	const listClass = await Class.find();
	res.json(listClass);
});

app.post('/classes', async (req, res) => {
	const newClass = new Class(req.body);
	await newClass.save();
	res.status(202).json(newClass);
});

app.post('/register', async (req, res) => {
	const rs = await Account.find({ email: req.body.email}).exec();
	if(rs.length > 0) {
		res.status(409).json('email already exist!');
		return;
	}

  const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);
	const newAccount = new Account({...req.body, refresh_token: jwtRefreshToken});
	const {_id, role} = await newAccount.save();
  const jwtPayload = {id: _id.toString(), role};
  const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);
  return res.status(201).json({
    message: 'Register account successfully',
    jwtAccessToken,
    jwtRefreshToken
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [account] = await Account.find({ email: req.body.email}).exec();
  if (!account) {
    return res.status(401).json({
      message: 'Email does not exist'
    });
  }

  const validate = account.password === password;
  if (!validate) {
    return res.status(401).json({
      message: 'Incorrect password'
    });
  }

  const { _id } = account;
  const jwtPayload = { id: _id };
  const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);
  const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);

  account.refresh_token = jwtRefreshToken;
  await account.save();

  return res.status(201).json({
    jwtAccessToken,
    jwtRefreshToken,
    email: account.email,
  });
});
const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
