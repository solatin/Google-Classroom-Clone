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

router.get('/classes', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		if (account.role === 'student' || account.role === 'teacher') {
			res.status(401).send({
				message: 'This role cannot use this function.'
			});
			return;
		}
		const listClass = await Class.find();
		res.status(200).json(listClass);
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: 'Cannot get classes.'
		})
	}
})

router.get('/users', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		if (account.role === 'student' || account.role === 'teacher') {
			res.status(401).send({
				message: 'This role cannot use this function.'
			});
			return;
		}
		const listUser = await Account.find();
		res.status(200).json(listUser);
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: 'Cannot get classes.'
		})
	}
})

router.post('/banAccount', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		if (account.role === 'student' || account.role === 'teacher') {
			res.status(401).send({
				message: 'This role cannot use this function.'
			});
			return;
		}
		const bannedUser = await Account.findById(req.body.userId);
		bannedUser.status = 'banned';
		await bannedUser.save();
		res.end();
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: 'Ban failed.'
		})
	}
})

router.post('/unbanAccount', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		if (account.role === 'student' || account.role === 'teacher') {
			res.status(401).send({
				message: 'This role cannot use this function.'
			});
			return;
		}
		const bannedUser = await Account.findById(req.body.userId);
		bannedUser.status = 'unbanned';
		await bannedUser.save();
		res.end();
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: 'Unban failed.'
		})
	}
})

module.exports = router;