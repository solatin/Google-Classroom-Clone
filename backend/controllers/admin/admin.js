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

const { verifyToken, generateToken } = require('../../utils/jwt');
const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const ACCESS_EXP = parseInt(process.env.JWT_ACCESS_TOKEN_EXP);
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
const REFRESH_EXP = parseInt(process.env.JWT_REFRESH_TOKEN_EXP);

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
		const listResult = [];
		for (let index = 0; index < listClass.length; index++) {
			const element = listClass[index];
			const owner = await Account.findById(element.owner_id);
			const listStudent = await ClassStudent.find({ code: element.code })
			listResult.push({ class: element, owner: owner, numberOfStudent: listStudent.length });
		}
		res.status(200).json(listResult);
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
		const listUser = await Account.find({ role: { $ne: 'admin' } });
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

router.post('/createAccount', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		if (account.role === 'student' || account.role === 'teacher') {
			res.status(401).send({
				message: 'This role cannot use this function.'
			});
			return;
		}
		const rs = await Account.findOne({ email: req.body.email });
		if (rs) {
			res.status(401).send({
				message: "This email has been used."
			});
			return;
		}
		const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);
		const newAccount = new Account({ email: req.body.email, password: req.body.password, refresh_token: jwtRefreshToken, role: 'admin' });
		const { _id, role } = await newAccount.save();
		const jwtPayload = { id: _id.toString(), role };
		const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);
		return res.status(201).json({
			message: 'Add admin account successfully',
			jwtAccessToken,
			jwtRefreshToken
		});
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: "Add admin account failed",
		});
	}
})

router.get('/getListAdminAccount', async (req, res) => {
	try {
		const account = res.locals.account;
		if (account.role === 'student' || account.role === 'teacher') {
			res.status(401).send({
				message: 'This role cannot use this function.'
			});
			return;
		}
		const listAdmin = await Account.find({ role: 'admin' });
		res.status(200).json(listAdmin);
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: "Get list admin account failed",
		});
	}
})

module.exports = router;