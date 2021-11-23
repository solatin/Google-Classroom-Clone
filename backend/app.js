const express = require('express');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const Class = require('./models/class.js');
const Account = require('./models/account.js');
const ClassStudent = require('./models/class_student');
const ClassTeacher = require('./models/class_teacher');
const { generateToken } = require('./utils/jwt.js');
const auth = require('./middlewares/auth.js');
const account = require('./models/account.js');

const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const ACCESS_EXP = parseInt(process.env.JWT_ACCESS_TOKEN_EXP);
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
const REFRESH_EXP = parseInt(process.env.JWT_REFRESH_TOKEN_EXP);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'test.22.11.2021@gmail.com',
    pass: '18CNTNWNC'
  }
})

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
  const account = res.locals.account;
  const listClassMember = account.role === 'teacher' ? await ClassTeacher.find({ 'teacher_id': account.id }) : await ClassStudent.find({ 'student_id': account.id });
  const listClassCode = [];
  for (let index = 0; index < listClassMember.length; index++) {
    const element = listClassMember[index];
    listClassCode.push(element.code)
  }
  const listClass = await Class.find({ 'code': { $in: listClassCode } });
  res.json(listClass);
});

app.get('/class-details/:id/feed', async (req, res) => {
  // Get class data (class name, teacher name, announcements)

  const classData = await Class.findById(req.params.id);
  // console.log(classData);
  res.json(classData);
});

app.get('/class-details/:id/members', async (req, res) => {
  // Get members in class

  const classData = await Class.findById(req.params.id);
  // console.log(classData);
  res.json(classData);
});

function makeCode(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.post('/classes', auth, async (req, res) => {
  const account = res.locals.account;
  const newClass = new Class({ owner_id: account.id, name: req.body.name, code: makeCode(6) });
  const newClassMember = account.role === 'teacher' ? new ClassTeacher({ teacher_id: account.id, code: newClass.code }) : new ClassStudent({ student_id: account.id, code: newClass.code });
  await newClassMember.save();
  await newClass.save();
  res.status(202).json(newClass);
});

app.post('/register', async (req, res) => {
  const rs = await Account.find({ email: req.body.email }).exec();
  if (rs.length > 0) {
    res.status(409).json('email already exist!');
    return;
  }

  const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);
  const newAccount = new Account({ ...req.body, refresh_token: jwtRefreshToken });
  const { _id, role } = await newAccount.save();
  const jwtPayload = { id: _id.toString(), role };
  const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);
  return res.status(201).json({
    message: 'Register account successfully',
    jwtAccessToken,
    jwtRefreshToken
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [account] = await Account.find({ email: req.body.email }).exec();
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

  const { _id, role } = account;
  const jwtPayload = { id: _id, role };
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
app.get('/sendInvite', async (req, res) => {
  var mailOptions = {
    from: 'ttdat.09.08.2000@gmail.com',
    to: 'bobyba20@gmail.com',
    subject: 'Invite to classroom',
    text: 'You have been invited to join our classroom. If you don\'t join, Fuck you!!!'
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Email sent Success");
    }
  })
});
app.get('/sendInvite', async (req, res) => {
  var mailOptions = {
    from: 'test.22.11.2021@gmail.com',
    to: 'bobyba20@gmail.com',
    subject: 'Invite to classroom',
    text: 'You have been invited to join our classroom. If you don\'t join, Fuck you!!!'
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent Success");
    }
  })
})

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});