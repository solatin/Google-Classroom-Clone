const express = require('express');
const mongoose = require('mongoose');
const readXlsxFile = require('read-excel-file/node');
var nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const Class = require('./models/class.js');
const Account = require('./models/account.js');
const ClassStudent = require('./models/class_student');
const ClassTeacher = require('./models/class_teacher');
const GradeStructure = require('./models/grade_structure');
const ClassStudentId = require('./models/class_student_id');
const ClassStudentGrade = require('./models/class_student_grade');
const { generateToken } = require('./utils/jwt.js');
const auth = require('./middlewares/auth.js');
const account = require('./models/account.js');
const { find } = require('./models/class.js');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'test.22.11.2021@gmail.com',
    pass: '18CNTNWNC'
  }
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

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
app.use('/auth/', require('./controllers/account'));

app.get('/classes', auth, async (req, res) => {
  const account = res.locals.account;
  const listClassMember =
    account.role === 'teacher'
      ? await ClassTeacher.find({ teacher_id: account.id })
      : await ClassStudent.find({ student_id: account.id });
  const listClassCode = [];
  for (let index = 0; index < listClassMember.length; index++) {
    const element = listClassMember[index];
    listClassCode.push(element.code);
  }
  const listClass = await Class.find({ code: { $in: listClassCode } });
  res.json(listClass);
});

app.post('/class-details/feed', auth, async (req, res) => {
  const id = req.body.classId;
  const classroom = await Class.findById(id);
  const owner = await Account.findById(classroom.owner_id);
  const classData = { code: classroom.code, teacher_name: owner.display_name, id: id, name: classroom.name };

  res.json(classData);
});

app.post('/class-details/members', auth, async (req, res) => {
  const account = res.locals.account;
  const classroom = await Class.findById(req.body.classId);
  const listStudent = await ClassStudent.find({ code: classroom.code });
  const listStudentId = [];
  for (let index = 0; index < listStudent.length; index++) {
    const element = listStudent[index];
    listStudentId.push(mongoose.Types.ObjectId(element.student_id));
  }
  const listStudentInfo = await Account.find({ _id: { $in: listStudentId } });
  const listStudentRes = [];
  for (let index = 0; index < listStudent.length; index++) {
    const element = listStudent[index];
    listStudentRes.push({
      student_class_id: element.student_class_id,
      display_name: listStudentInfo[index].display_name,
      can_change: account.id === element.student_id
    });
  }

  const listTeacher = await ClassTeacher.find({ code: classroom.code });
  const listTeacherId = [];
  for (let index = 0; index < listTeacher.length; index++) {
    const element = listTeacher[index];
    listTeacherId.push(mongoose.Types.ObjectId(element.teacher_id));
  }
  const listTeacherRes = await Account.find({ _id: { $in: listTeacherId } });

  res.json({ listTeacher: listTeacherRes, listStudent: listStudentRes });
});

app.get('/profile', auth, async (req, res) => {
  const account = res.locals.account;
  // console.log(account);
  const profileData = await Account.findById(account.id);
  // console.log(profileData);
  res.json(profileData);
});

app.post('/changePassword/', auth, async (req, res) => {
  const account = await Account.findById(res.locals.account.id);
  if (account.password === req.body.oldPass) {
    account.password = req.body.newPass;
    account.save();
  }
  res.end();
});

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
}

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
  const newClassMember =
    account.role === 'teacher'
      ? new ClassTeacher({ teacher_id: account.id, code: newClass.code })
      : new ClassStudent({ student_id: account.id, code: newClass.code });
  await newClassMember.save();
  await newClass.save();
  res.status(202).json(newClass);
});

app.post('/sendInvite', auth, async (req, res) => {
  var mailOptions = {
    from: 'test.22.11.2021@gmail.com',
    to: req.body.email,
    subject: 'Invite to classroom',
    text:
      'You have been invited to join our classroom. Please login to your account and follow this link: http://localhost:3000/acceptInvite/' +
      req.body.classId
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent Success');
    }
  });
});

app.post('/acceptInvite', auth, async (req, res) => {
  const account = res.locals.account;
  const id = req.body.classId;
  const newClass = await Class.findById(id);
  const result = await (account.role === 'teacher'
    ? await ClassTeacher.find({ teacher_id: account.id, code: newClass.code })
    : await ClassStudent.find({ student_id: account.id, code: newClass.code }));

  const checkExist = result.length !== 0;
  if (checkExist === false) {
    const newClassMember =
      account.role === 'teacher'
        ? new ClassTeacher({ teacher_id: account.id, code: newClass.code })
        : new ClassStudent({ student_id: account.id, code: newClass.code });
    await newClassMember.save();
  }
});

app.post('/ChangeStudentClassID', auth, async (req, res) => {
  const account = res.locals.account;
  const classroom = await Class.findById(req.body.classId);
  const rs = await ClassStudent.findOneAndUpdate(
    { code: classroom.code, student_id: account.id },
    { student_class_id: req.body.studentClassID }
  );
  res.end();
});

app.post('/getGradeStructure', auth, async (req, res) => {
  const listGradeStructure = await GradeStructure.find({ class_id: req.body.classId });
  listGradeStructure.sort((grade_1, grade_2) =>
    grade_1.position > grade_2.position ? 1 : grade_2.position > grade_1.position ? -1 : 0
  );
  res.json(listGradeStructure);
});

app.post('/addGradeStructure', auth, async (req, res) => {
  const listGradeStructure = await GradeStructure.find({ class_id: req.body.class_id });
  const newGradeStructure = new GradeStructure({
    class_id: req.body.class_id,
    title: req.body.gradeTitle,
    grade: req.body.grade,
    position: listGradeStructure.length
  });
  await newGradeStructure.save();
  res.end();
});

app.post('/deleteGradeStructure', auth, async (req, res) => {
  try {
    await GradeStructure.findByIdAndRemove(req.body.gradeStructureId);
    const listGradeStrucutre = await GradeStructure.find({ class_id: req.body.classId });
    listGradeStrucutre.sort((grade_1, grade_2) =>
      grade_1.position > grade_2.position ? 1 : grade_2.position > grade_1.position ? -1 : 0
    );
    for (let index = 0; index < listGradeStrucutre.length; index++) {
      listGradeStrucutre[index].position = index;
      listGradeStrucutre[index].save();
    }
    res.end();
  } catch (error) {
    res.status(400).send({
      message: 'Delete failed'
    });
  }
});

app.post('/updateGradeStructure', auth, async (req, res) => {
  try {
    const curGradeStructure = await GradeStructure.findById(req.body.gradeStructure.Id);
    curGradeStructure.title = req.body.gradeStructure.title;
    curGradeStructure.grade = req.body.gradeStructure.grade;
    await curGradeStructure.save();
    res.end();
  } catch (error) {
    res.status(400).send({
      message: 'Update failed'
    });
  }
});

app.post('/arrangeGradeStructure', auth, async (req, res) => {
  try {
    const listGradeStrucutre = await GradeStructure.find({ class_id: req.body.classId });
    const newListGradeStructure = req.body.listGradeStructure;
    for (let i = 0; i < listGradeStrucutre.length; i++) {
      const gradeStructure = listGradeStrucutre[i];
      for (let j = 0; j < newListGradeStructure.length; j++) {
        const newGradeStructure = newListGradeStructure[j];
        if (gradeStructure._id == newGradeStructure._id) {
          listGradeStrucutre[i].position = newGradeStructure.position;
          await listGradeStrucutre[i].save();
          break;
        }
      }
    }
    res.end();
  } catch (error) {
    res.status(400).send({
      message: 'Arrange failed'
    });
  }
});

var listNewStudentId = async (listCurrentStudentId, listFileStudentId) => {
  const listNew = [];
  for (let i = 0; i < listFileStudentId.length; i++) {
    const fileStudent = listFileStudentId[i];
    let isExist = false;
    for (let j = 0; j < listCurrentStudentId.length; j++) {
      const currentStudent = listCurrentStudentId[j];
      if (fileStudent[0] == currentStudent.student_class_id) {
        currentStudent.student_name = fileStudent[1];
        await currentStudent.save();
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      listNew.push(fileStudent);
    }
  }
  return listNew;
};

app.post('/uploadStudentListFile/:classId', auth, upload.single('excelFile'), async (req, res) => {
  try {
    const classId = req.params.classId;
    if (req.file == undefined) {
      return res.status(400).send('Please upload an excel file!');
    }
    const listCurrent = await ClassStudentId.find({ status: true, class_id: classId });

    await readXlsxFile('uploads/' + req.file.filename).then(async (rows) => {
      // remove first row ['MMSV', 'Ten']
      rows.shift();
      console.log(rows);

      const listNew = await listNewStudentId(listCurrent, rows);
      const listStudentId = listNew.map(
        (item) =>
          new ClassStudentId({
            class_id: classId,
            student_class_id: item[0],
            student_name: item[1],
            status: true
          })
      );
      ClassStudentId.insertMany(listStudentId);
    });
    res.json(listStudentId);
  } catch (error) {
    res.status(500).send({
      message: 'Could not upload the file: ' + req.file.originalname
    });
  }
});

app.post('/getStudentListFile/:classId', auth, async (req, res) => {
  try {
    const classId = req.params.classId;
    const listStudentId = await ClassStudentId.find({ status: true, class_id: classId, status: true });

    res.json(listStudentId);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Could not send info'
    });
  }
});

app.post('/updateStudentGrade/:classId/:studentClassId/:gradeStructureId', auth, async (req, res) => {
  try {
    const classId = req.params.classId;
    const studentClassId = req.params.studentClassId;
    const gradeStructureId = req.params.gradeStructureId;
    const grade = req.body.grade;
    const obj = await ClassStudentGrade.findOne({
      class_id: classId,
      student_class_id: studentClassId,
      grade_structure_id: gradeStructureId,
    });
    if (!obj) {
      const newGrade = new ClassStudentGrade(
        {
          class_id: classId,
          student_class_id: studentClassId,
          grade_structure_id: gradeStructureId,
          student_grade: grade,
          status: true
        });
      await newGrade.save();
    } else {
      obj.student_grade = grade;
      await obj.save();
    }
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Error in updating'
    });
  }
});

var listNewStudentGrade = async (listCurrentStudentGrade, listFileStudentGrade) => {
  const listNew = [];
  for (let i = 0; i < listFileStudentGrade.length; i++) {
    const fileStudent = listFileStudentGrade[i];
    let isExist = false;
    for (let j = 0; j < listCurrentStudentGrade.length; j++) {
      const currentStudent = listCurrentStudentGrade[j];
      if (fileStudent[0] == currentStudent.student_class_id) {
        currentStudent.student_grade = fileStudent[1];
        await currentStudent.save();
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      listNew.push(fileStudent);
    }
  }
  console.log(listNew);
  return listNew;
};

app.post(
  '/uploadStudentGradeListFile/:classId/:gradeStructureId',
  auth,
  upload.single('excelFile'),
  async (req, res) => {
    try {
      const classId = req.params.classId;
      const gradeStructureId = req.params.gradeStructureId;
      if (req.file == undefined) {
        return res.status(400).send('Please upload an excel file!');
      }
      const listCurrent = await ClassStudentGrade.find({
        status: true,
        class_id: classId,
        grade_structure_id: gradeStructureId
      });

      await readXlsxFile('uploads/' + req.file.filename).then(async (rows) => {
        rows.shift();
        const listNew = await listNewStudentGrade(listCurrent, rows);
        const listStudentGrade = listNew.map(
          (item) =>
            new ClassStudentGrade({
              class_id: classId,
              student_class_id: item[0],
              student_grade: item[1],
              grade_structure_id: gradeStructureId,
              status: true
            })
        );
        await ClassStudentGrade.insertMany(listStudentGrade);
      });
      res.json(listStudentGrade);
    } catch (error) {
      res.status(500).send({
        message: 'Could not upload the file: ' + req.file.originalname
      });
    }
  }
);

app.get('/getAllGrade/:classId', async (req, res) => {
  try {
    const classId = req.params.classId;
    const gradeStructure = await GradeStructure.find({ class_id: classId });
    const listStudentName = await ClassStudentId.find({ status: true, class_id: classId });
    const listGrade = await ClassStudentGrade.find({ status: true, class_id: classId });
    const listReturn = [];
    const totalSum = gradeStructure.map(value => parseFloat(value.grade)).reduce((a, b) => a + b, 0);
    listStudentName.forEach((student) => {
      const listStudentGrade = listGrade.filter((grade) => grade.student_class_id == student.student_class_id);
      const averageGrade = listStudentGrade.map((value) => {
        const baseVal = gradeStructure.find(element => element._id.toString() == value.grade_structure_id);
        const result = parseFloat(value.student_grade);
        return result;
      }).reduce((a, b) => a + b, 0);
      listReturn.push({
        studentId: student.student_class_id,
        studentName: student.student_name,
        studentGrade: listStudentGrade,
        averageGrade: averageGrade,
      });
    });

    const listTotalGrade = [];
    for (let index = 0; index < gradeStructure.length; index++) {
      const grade = gradeStructure[index];
      const listStudent = await ClassStudentGrade.find({ status: true, class_id: classId, grade_structure_id: grade._id.toString() });
      const totalSumOfGrade = listStudent.map(student => parseFloat(student.student_grade)).reduce((a, b) => a + b, 0);
      listTotalGrade.push({ grade: grade, totalGrade: totalSumOfGrade });
    }
    res.json({ listStudent: listReturn, listTotalGrade: listTotalGrade, });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Could not get grade.'
    });
  }
});



app.get('/hello', async (req, res) => {
  var result = [];
  await readXlsxFile('uploads/hello.xlsx').then((rows) => {
    result = rows.map((item) => {
      return { student_class_id: item[0], student_name: item[1], status: true };
    });
  });
  res.json(result);
});

app.get('/a', function (req, res) {
  res.sendFile(__dirname + '/upload.html');
});

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
