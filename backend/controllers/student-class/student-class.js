const express = require('express');
const router = express.Router();
const multer = require('multer');

const Class = require('../../models/class.js');
const Account = require('../../models/account.js');
const ClassStudent = require('../../models/class_student');
const ClassTeacher = require('../../models/class_teacher');
const GradeStructure = require('../../models/grade_structure');
const ClassStudentId = require('../../models/class_student_id');
const ClassStudentGrade = require('../../models/class_student_grade');

const auth = require('../../middlewares/auth');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

var upload = multer({ storage: storage });

router.post('/ChangeStudentClassID', auth, async (req, res) => {
	const account = res.locals.account;
	const classroom = await Class.findById(req.body.classId);
	const rs = await ClassStudent.findOneAndUpdate(
		{ code: classroom.code, student_id: account.id },
		{ student_class_id: req.body.studentClassID }
	);
	res.end();
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

router.post('/uploadStudentListFile/:classId', auth, upload.single('excelFile'), async (req, res) => {
	try {
		const classId = req.params.classId;
		if (req.file == undefined) {
			return res.status(400).send('Please upload an excel file!');
		}
		const listCurrent = await ClassStudentId.find({ status: true, class_id: classId });

		const rows = await readXlsxFile('uploads/' + req.file.filename);

		// remove first row ['MMSV', 'Ten']
		rows.shift();

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
		await ClassStudentId.insertMany(listStudentId);
		res.json(listStudentId);

	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: 'Could not upload the file: ' + req.file.originalname
		});
	}
});

router.post('/getStudentListFile/:classId', auth, async (req, res) => {
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

module.exports = router;