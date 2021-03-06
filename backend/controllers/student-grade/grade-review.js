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
const Notification = require('../../models/notification');

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
    if (gradeStructure.finalized !== 'finalized') {
      res.status(402).send({
        message: "This grade structure hasn't been done, no review."
      });
      return;
    }
    const currentGradeReview = await GradeReview.findOne({
      student_class_id: student.student_class_id,
      grade_structure_id: gradeStructureId,
    });
    if (currentGradeReview) {
      res.status(403).send({
        message: "This has been initialized before.",
        review: currentGradeReview,
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

    //Notification
    const listTeacher = await ClassTeacher.find({ code: classroom.code });
    const listNotification = [];
    for (let index = 0; index < listTeacher.length; index++) {
      const teacher = listTeacher[index];
      if (teacher.teacher_id !== account.id) {
        listNotification.push(
          new Notification({
            user_id: teacher.teacher_id,
            content: user.display_name + ' need a review at ' + gradeStructure.title,
            link: 'http://localhost:3000/', //link to review
            status: 'unread'
          })
        );
      }
    }

    await Notification.insertMany(listNotification).then(function () {
      console.log("Notification Inserted")  // Success
    }).catch(function (error) {
      console.log(error);     // Failure
      res.status(402).send({
        message: 'Insert Notification failed.'
      });
    });

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

    //Notification
    const gradeStructure = await GradeStructure.findById(gradeReview.grade_structure_id);
    const classroom = await Class.findById(gradeStructure.class_id);
    const listTeacher = await ClassTeacher.find({ code: classroom.code });
    const listNotification = [];
    for (let index = 0; index < listTeacher.length; index++) {
      const teacher = listTeacher[index];
      if (teacher.teacher_id !== account.id) {
        listNotification.push(
          new Notification({
            user_id: teacher.teacher_id,
            content: user.display_name + ' comment at review.',
            link: 'http://localhost:3000/', //link to review
            status: 'unread'
          })
        );
      }
    }
    if (account.role === 'teacher') {
      const student = gradeReview.comment[0].user;
      listNotification.push(
        new Notification({
          user_id: student._id,
          content: user.display_name + ' comment at your review.',
          link: 'http://localhost:3000/', //link to review
          status: 'unread'
        })
      );
    }

    await Notification.insertMany(listNotification).then(function () {
      console.log("Notification Inserted")  // Success
    }).catch(function (error) {
      console.log(error);     // Failure
      res.status(402).send({
        message: 'Insert Notification failed.'
      });
    });

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
      const listReviewWithGrade = [];
      for (let j = 0; j < listReview.length; j++) {
        const review = listReview[j];
        const currentGrade = await ClassStudentGrade.findOne({ student_class_id: review.student_class_id, grade_structure_id: review.grade_structure_id });
        if (currentGrade)
          listReviewWithGrade.push({ review: review, grade: currentGrade.student_grade });
        else
          listReviewWithGrade.push({ review: review });
      }
      listResult.push({ gradeStructure: element, listReview: listReviewWithGrade });
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
      const gradeReview = await GradeReview.findOne({ student_class_id: student.student_class_id, grade_structure_id: gradeStructureId });
      res.status(200).json(gradeReview);
      return;
    } else {
      const gradeStructure = await GradeStructure.find({ class_id: classId });
      const listResult = [];
      let overall = 0;
      for (let index = 0; index < gradeStructure.length; index++) {
        const element = gradeStructure[index];
        const review = await GradeReview.findOne({ grade_structure_id: element._id, student_class_id: student.student_class_id });
        const currentGrade = await ClassStudentGrade.findOne({ student_class_id: student.student_class_id, grade_structure_id: element._id });
        if (currentGrade) listResult.push({ gradeStructure: element, review: review, studentGrade: currentGrade.student_grade });
        else listResult.push({ gradeStructure: element, review: review, studentGrade: 0 });
        if (currentGrade && (element.finalized === 'finalized' || element.finalized === 'done')) {
          overall = overall + parseFloat('0' + currentGrade.student_grade);
        }
      }
      res.status(200).json({ listGrade: listResult, overall });
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

router.get('/markAsDone', auth, async (req, res) => {
  try {
    const review = await GradeReview.findById(req.query.id);
    review.status = 'solved';
    await review.save();
    const student = review.comment[0].user;
    const noti = new Notification({ user_id: student._id, content: 'Your teacher has finalled your review.', status: 'unread' });
    await noti.save();
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Mark as done failed.'
    });
  }
})

router.get('/detail', auth, async (req, res) => {
  try {
    var review = await GradeReview.findById(req.query.id);
    const currentGrade = await ClassStudentGrade.findOne({ student_class_id: review.student_class_id, grade_structure_id: review.grade_structure_id });
    res.status(200).json({
      id: review.id,
      student_class_id: review.student_class_id,
      student_expect_grade: review.student_grade,
      grade_structure_id: review.grade_structure_id,
      comment: review.comment,
      current_grade: currentGrade?.student_grade,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Get failed.'
    });
  }
})

module.exports = router;