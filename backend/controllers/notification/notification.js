const express = require('express');
const router = express.Router();

const Class = require('../../models/class.js');
const Account = require('../../models/account.js');
const ClassStudent = require('../../models/class_student');
const ClassTeacher = require('../../models/class_teacher');
const GradeStructure = require('../../models/grade_structure');
const ClassStudentId = require('../../models/class_student_id');
const ClassStudentGrade = require('../../models/class_student_grade');
const Notification = require('../../models/notification');

const auth = require('../../middlewares/auth');

router.get('/', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		const listNotification = await Notification.find({ user_id: account.id });
		await Notification.updateMany({ user_id: account.id }, { "$set": { status: 'read' } });
		res.status(200).json(listNotification);
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: 'Get notification failed.'
		});
	}
})

router.get('/count', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		const listNotification = await Notification.find({ user_id: account.id, status: 'unread' });
		res.status(200).json({ count: listNotification.length });
	} catch (error) {
		console.error(error);
		res.status(400).send({
			message: 'Get notification count failed.'
		});
	}
})

module.exports = router;