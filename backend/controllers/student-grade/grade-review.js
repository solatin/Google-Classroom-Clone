const express = require('express');
const router = express.Router();

const Class = require('../../models/class.js');
const Account = require('../../models/account.js');
const ClassStudent = require('../../models/class_student');
const ClassTeacher = require('../../models/class_teacher');
const GradeStructure = require('../../models/grade_structure');
const ClassStudentId = require('../../models/class_student_id');
const ClassStudentGrade = require('../../models/class_student_grade');
const GradeReview = require('../../models/grade_review');

const auth = require('../../middlewares/auth');

router.post('/add', auth, async (req, res) => {
  try {
    const account = res.locals.account;
    // const account = { id: '619e48c2374a8f085c53b577', role: 'student' };
    if (account.role == 'teacher') {
      res.status(401).send({
        message: 'This api is for student.'
      });
      return;
    }
    const user = await Account.findById(account.id);
    const gradeStructureId = req.body.gradeStructureId;
    const expectGrade = req.body.grade;
    const explanation = req.body.explanation ?? '';
    const classroom = await Class.findById(req.body.classId);
    const student = await ClassStudent.findOne({ code: classroom.code, student_id: account.id });
    const gradeStructure = await GradeStructure.findById(gradeStructureId);
    if (gradeStructure.finalized == 'Done') {
      res.status(402).send({
        message: 'This grade structure has been done, no more review.'
      });
      return;
    }
    const gradeReview = new GradeReview({
      student_class_id: student.student_class_id,
      student_grade: expectGrade,
      grade_structure_id: gradeStructureId,
      comment: [{ comment: explanation, user: user }],
      status: "unsolved"
    });
    await gradeReview.save();
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Could not add review.'
    });
  }
})

router.post('/comment', auth, async (req, res) => {
  try {
    // const account = { id: '619e48c2374a8f085c53b577', role: 'student' };
    const account = res.locals.account;
    const user = await Account.findById(account.id);
    const gradeReview = await GradeReview.findById(req.body.id);
    gradeReview.comment.push({ comment: req.body.comment, user: user });
    await gradeReview.save();
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Comment failed.'
    });
  }
})

router.get('/all/', auth, async (req, res) => {
  try {
    const account = res.locals.account;
    // const account = { id: "619e4702cd40c6dc7eb5ab8d", role: "teacher" };
    if (account.role == 'student') {
      res.status(401).send({
        message: 'This api is for teacher.'
      });
      return;
    }
    const classId = req.query.classId;
    const gradeStructure = await GradeStructure.find({ class_id: classId });
    const listResult = [];
    for (let index = 0; index < gradeStructure.length; index++) {
      const element = gradeStructure[index];
      const listReview = await GradeReview.find({ grade_structure_id: element._id });
      listResult.push({ gradeStructure: element, listReview: listReview });
    }
    res.status(200).json(listResult);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Get review failed.'
    });
  }
})

router.get('/forStudent', auth, async (req, res) => {
  try {
    const account = res.locals.account;
    // const account = { id: '619e48c2374a8f085c53b577', role: 'student' };
    if (account.role == 'teacher') {
      res.status(401).send({
        message: 'This api is for student.'
      });
      return;
    }
    const classId = req.query.classId;
    const gradeStructureId = req.query.gradeStructureId;
    const classroom = await Class.findById(classId);
    const student = await ClassStudent.findOne({ code: classroom.code, student_id: account.id });
    if (gradeStructureId) {
      const gradeReview = await GradeReview.find({ student_class_id: student.student_class_id, grade_structure_id: gradeStructureId });
      res.status(200).json(gradeReview);
      return;
    } else {
      const gradeStructure = await GradeStructure.find({ class_id: classId });
      const listResult = [];
      for (let index = 0; index < gradeStructure.length; index++) {
        const element = gradeStructure[index];
        const listReview = await GradeReview.find({ grade_structure_id: element._id, student_class_id: student.student_class_id });
        listResult.push({ gradeStructure: element, listReview: listReview });
      }
      res.status(200).json(listResult);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Get review failed.'
    });
  }
})

router.get('/byGradeStructure', auth, async (req, res) => {
  try {
    const account = res.locals.account;
    if (account.role == 'student') {
      res.status(401).send({
        message: 'This api is for teacher.'
      });
      return;
    }
    const gradeStructureId = req.query.gradeStructureId;
    const listReview = await GradeReview.find({ grade_structure_id: gradeStructureId });
    res.status(200).json(listReview);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Get review failed.'
    });
  }
})

router.get('/byId', auth, async (req, res) => {
  try {
    const review = await GradeReview.findById(req.query.id);
    res.status(200).json(review);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Get review failed.'
    });
  }
})

router.get('/markAsDone', async (req, res) => {
  try {
    const review = await GradeReview.findById(req.query.id);
    review.status = 'solved';
    await review.save();
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Mark as done failed.'
    });
  }
})

module.exports = router;