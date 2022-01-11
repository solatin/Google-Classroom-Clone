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

app.use('/class/', require('./controllers/class/class'));

app.use('/class-details/', require('./controllers/class/class-detail'));

app.use('/profile/', require('./controllers/user/profile'));

app.use('/gradeStructure/', require('./controllers/grade-structure/grade-structure'));

app.use('/studentClass/', require('./controllers/student-class/student-class'));

app.use('/studentGrade/', require('./controllers/student-grade/student-grade'));

app.post('/finalized', auth, async (req, res) => {
  try {
    const gradeStructureId = req.body.gradeStructureId;
    const gradeStructure = await GradeStructure.findById(gradeStructureId);
    gradeStructure.finalized = true;
    await gradeStructure.save();
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Could not finalized.'
    });
  }
})

app.post('/unfinalized', auth, async (req, res) => {
  try {
    const gradeStructureId = req.body.gradeStructureId;
    const gradeStructure = await GradeStructure.findById(gradeStructureId);
    gradeStructure.finalized = false;
    await gradeStructure.save();
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Could not unfinalized.'
    });
  }
})

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
