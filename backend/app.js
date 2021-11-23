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
})
app.use('/auth/', require('./controllers/account'));

app.get('/classes', auth, async (req, res) => {
  console.log(res.locals.account);

  const listClass = await Class.find();
  res.json(listClass);
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
  // console.log(listClass);
  res.json(listClass);
});


// to do
app.get('/class-details/:id/feed', auth, async (req, res) => {
  // Get class data (class name, teacher name, announcements)

  const account = res.locals.account;
  const listClassTeacher = await ClassTeacher.find({ 'teacher_id': account._id });
  const listClassMember = account.role === 'teacher' ? await ClassTeacher.find({ 'teacher_id': account.id }) : await ClassStudent.find({ 'student_id': account.id });
  const listClassCode = [];
  for (let index = 0; index < listClassMember.length; index++) {
    const element = listClassMember[index];
    listClassCode.push(element.code)
  }
  
  let classData = await Class.findById(req.params.id);
  classData.teacher_name = 'Quang';

  console.log(classData);
  res.json(classData);
});


// to do
app.get('/class-details/:id/members', auth, async (req, res) => {
  // Get members in class

  const account = res.locals.account;
  const ClassMember = account.role === 'teacher' ? await ClassTeacher.find({ 'teacher_id': account.id }) : await ClassStudent.find({ 'student_id': account.id });

  console.log(ClassMember);
  const classData = await Class.findById(req.params.id);
  // console.log(classData);
  res.json(ClassMember);
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

app.post('/sendInviteTeacher', auth, async (req, res) => {
  var mailOptions = {
    from: 'test.22.11.2021@gmail.com',
    to: req.body.email,
    subject: 'Invite to classroom',
    text: 'You have been invited to join our classroom. Please login to your account and follow this link: http://localhost:3000/acceptInvite/' + req.body.classId + '/' + req.body.email
  }
  console.log(req.body);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent Success");
    }
  })
})

app.get('/acceptInvite/:id/:email', auth, async (req, res) => {
  console.log(1);
  const account = res.locals.account;
  const acc = await Account.findById(id);
  console.log(acc)
  if (acc.email === email) {
    const newClass = await Class.findById(id);
    const checkExist = (account.role === 'teacher' ? ClassTeacher.find({ teacher_id: account.id, code: newClass.code }) : ClassStudent.find({ student_id: account.id, code: newClass.code })).length !== 0;
    if (checkExist === false) {
      const newClassMember = account.role === 'teacher' ? new ClassTeacher({ teacher_id: account.id, code: newClass.code }) : new ClassStudent({ student_id: account.id, code: newClass.code });
      await newClassMember.save();
    }
  }
})

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});