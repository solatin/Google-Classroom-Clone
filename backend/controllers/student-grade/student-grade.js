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

router.post('/update/:classId/:studentClassId/:gradeStructureId', auth, async (req, res) => {
	try {
		const classId = req.params.classId;
		const studentClassId = req.params.studentClassId;
		const gradeStructureId = req.params.gradeStructureId;
		const grade = req.body.grade;
		const obj = await ClassStudentGrade.findOne({
			class_id: classId,
			student_class_id: studentClassId,
			grade_structure_id: gradeStructureId
		});
		if (!obj) {
			const newGrade = new ClassStudentGrade({
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

router.post(
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

			const rows = await readXlsxFile('uploads/' + req.file.filename);
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
			res.json(listStudentGrade);
		} catch (error) {
			console.log(error);
			res.status(500).send({
				message: 'Could not upload the file: ' + req.file.originalname
			});
		}
	}
);


router.get('/getAllGrade/:classId', async (req, res) => {
	try {
		const classId = req.params.classId;
		const gradeStructure = await GradeStructure.find({ class_id: classId });
		const listStudentName = await ClassStudentId.find({ status: true, class_id: classId });
		const listGrade = await ClassStudentGrade.find({ status: true, class_id: classId });
		const listReturn = [];
		const totalSum = gradeStructure.map((value) => parseFloat(value.grade)).reduce((a, b) => a + b, 0);
		listStudentName.forEach((student) => {
			const listStudentGrade = listGrade.filter((grade) => grade.student_class_id == student.student_class_id);
			const averageGrade = listStudentGrade
				.map((value) => {
					const baseVal = gradeStructure.find((element) => element._id.toString() == value.grade_structure_id);
					const result = parseFloat(value.student_grade);
					return result;
				})
				.reduce((a, b) => a + b, 0);
			listReturn.push({
				studentId: student.student_class_id,
				studentName: student.student_name,
				studentGrade: listStudentGrade,
				averageGrade: averageGrade
			});
		});

		const listTotalGrade = [];
		for (let index = 0; index < gradeStructure.length; index++) {
			const grade = gradeStructure[index];
			const listStudent = await ClassStudentGrade.find({
				status: true,
				class_id: classId,
				grade_structure_id: grade._id.toString()
			});
			const totalSumOfGrade = listStudent
				.map((student) => parseFloat(student.student_grade))
				.reduce((a, b) => a + b, 0);
			listTotalGrade.push({ grade: grade, totalGrade: totalSumOfGrade });
		}
		res.json({ listStudent: listReturn, listTotalGrade: listTotalGrade });
	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: 'Could not get grade.'
		});
	}
});

router.get('/student/:classId', auth, async (req, res) => {
	try {
		const account = res.locals.account;
		const classroom = await Class.findById(req.params.classId);
		if (account.role == 'teacher') {
			res.status(401).send({
				message: 'This api is for student.'
			});
			return;
		}
		const gradeStructure = await GradeStructure.find({ class_id: req.params.classId });
		const student = await ClassStudent.findOne({ code: classroom.code, student_id: account.id });
		const listResult = [];
		for (let index = 0; index < gradeStructure.length; index++) {
			const value = gradeStructure[index];
			if (value.finalized === undefined || value.finalized === 'unfinalized') {
				listResult.push({ gradeStructure: value, grade: "-1" });
				continue;
			}
			const grade = await ClassStudentGrade.findOne({ grade_structure_id: value._id, student_class_id: student.student_class_id });
			listResult.push({ gradeStructure: value, grade: grade.student_grade });
		}
		res.json({ listGrade: listResult });

	} catch (error) {
		console.log(error);
		res.status(400).send({
			message: 'Could not get grade.'
		});
	}
})

module.exports = router