const express = require('express');
const router = express.Router();

const ClassStudent = require('../../models/class_student');
const ClassTeacher = require('../../models/class_teacher');
const Class = require('../../models/class.js');

const auth = require('../../middlewares/auth');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'test.22.11.2021@gmail.com',
		pass: '18CNTNWNC'
	}
});

router.get('/', auth, async (req, res) => {
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


function makeCode(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

router.post('/', auth, async (req, res) => {
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

router.post('/sendInvite', auth, async (req, res) => {
	try {
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
		res.end();
	} catch (error) {
		res.status(400).send({
			message: 'Send failed'
		});
	}
});


router.post('/acceptInvite', auth, async (req, res) => {
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
	} else {
		res.status(401).send({
			message: "You have already been in this class."
		})
	}
});

router.post('/joinByCode', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		const classroom = await Class.findOne({ code: req.body.code });
		const result = await (account.role === 'teacher'
			? await ClassTeacher.find({ teacher_id: account.id, code: classroom.code })
			: await ClassStudent.find({ student_id: account.id, code: classroom.code }));

		const checkExist = result.length !== 0;
		if (checkExist === false) {
			const newClassMember =
				account.role === 'teacher'
					? new ClassTeacher({ teacher_id: account.id, code: classroom.code })
					: new ClassStudent({ student_id: account.id, code: classroom.code });
			await newClassMember.save();
			res.status(200).send({
				message: "Succeed."
			})
		} else {
			res.status(401).send({
				message: "You have already been in this class."
			})
		}
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: "Cannot join this class."
		})
	}

})

module.exports = router;