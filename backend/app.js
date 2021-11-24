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

app.post('/class-details/feed', auth, async (req, res) => {
  const id = req.body.classId;
  const classroom = await Class.findById(id);
  const owner = await Account.findById(classroom.owner_id);
  const classData = { 'code': classroom.code, 'teacher_name': owner.display_name, 'id': id, 'name': classroom.name }

  res.json(classData);
});

app.post('/class-details/members', auth, async (req, res) => {
  const account = res.locals.account;
  const classroom = await Class.findById(req.body.classId)
  const listStudent = await ClassStudent.find({ 'code': classroom.code })
  const listStudentId = [];
  for (let index = 0; index < listStudent.length; index++) {
    const element = listStudent[index];
    listStudentId.push(mongoose.Types.ObjectId(element.student_id));
  }
  const listStudentInfo = await Account.find({ '_id': { $in: listStudentId } });
  const listStudentRes = []
  for (let index = 0; index < listStudent.length; index++) {
    const element = listStudent[index];
    listStudentRes.push({ 'student_class_id': element.student_class_id, 'display_name': listStudentInfo[index].display_name, 'can_change': account.id === element.student_id });
  }

  const listTeacher = await ClassTeacher.find({ 'code': classroom.code })
  const listTeacherId = [];
  for (let index = 0; index < listTeacher.length; index++) {
    const element = listTeacher[index];
    listTeacherId.push(mongoose.Types.ObjectId(element.teacher_id));
  }
  const listTeacherRes = await Account.find({ '_id': { $in: listTeacherId } });

  res.json({ 'listTeacher': listTeacherRes, 'listStudent': listStudentRes });
});

app.get('/profile', auth, async (req, res) => {
  const account = res.locals.account;
  // console.log(account);
  const profileData = await Account.findById(account.id);
  // console.log(profileData);
  res.json(profileData);
})

app.post('/changePassword/', auth, async (req, res) => {
  const account = await Account.findById(res.locals.account.id);
  if (account.password === req.body.oldPass) {
    account.password = req.body.newPass;
    account.save();
  }
  res.end()
})

function changePassword(req, res, next) {
  // Init Variables
  let passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      Account.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(422).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(422).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

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

app.post('/sendInvite', auth, async (req, res) => {
  var mailOptions = {
    from: 'test.22.11.2021@gmail.com',
    to: req.body.email,
    subject: 'Invite to classroom',
    text: 'You have been invited to join our classroom. Please login to your account and follow this link: http://localhost:3000/acceptInvite/' + req.body.classId
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent Success");
    }
  })
})

app.post('/acceptInvite', auth, async (req, res) => {
  const account = res.locals.account;
  const id = req.body.classId;
  const newClass = await Class.findById(id);
  const result = await (account.role === 'teacher' ? await ClassTeacher.find({ teacher_id: account.id, code: newClass.code }) : await ClassStudent.find({ student_id: account.id, code: newClass.code }));

  const checkExist = result.length !== 0
  if (checkExist === false) {
    const newClassMember = account.role === 'teacher' ? new ClassTeacher({ teacher_id: account.id, code: newClass.code }) : new ClassStudent({ student_id: account.id, code: newClass.code });
    await newClassMember.save();
  }
})

app.post('/ChangeStudentClassID', auth, async (req, res) => {
  const account = res.locals.account;
  const classroom = await Class.findById(req.body.classId);
  const rs = await ClassStudent.findOneAndUpdate({ code: classroom.code, student_id: account.id }, { student_class_id: req.body.studentClassID });
  res.end();
})

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});