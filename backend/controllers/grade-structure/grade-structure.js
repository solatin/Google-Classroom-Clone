const express = require('express');
const router = express.Router();

const Class = require('../../models/class.js');
const Account = require('../../models/account.js');
const ClassStudent = require('../../models/class_student');
const ClassTeacher = require('../../models/class_teacher');
const GradeStructure = require('../../models/grade_structure');
const ClassStudentId = require('../../models/class_student_id');
const ClassStudentGrade = require('../../models/class_student_grade');

const auth = require('../../middlewares/auth');

router.post('/get', async (req, res) => {
    try {
        const listGradeStructure = await GradeStructure.find({ class_id: req.body.classId });
        listGradeStructure.sort((grade_1, grade_2) =>
            grade_1.position > grade_2.position ? 1 : grade_2.position > grade_1.position ? -1 : 0
        );
        res.json(listGradeStructure);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Get failed'
        });
    }
});

router.post('/add', async (req, res) => {
    try {
        const listGradeStructure = await GradeStructure.find({ class_id: req.body.class_id });
        const newGradeStructure = new GradeStructure({
            class_id: req.body.class_id,
            title: req.body.gradeTitle,
            grade: req.body.grade,
            position: listGradeStructure.length,
            finalized: 'unfinalized'
        });
        await newGradeStructure.save();
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Add failed'
        });
    }
});

router.post('/delete', auth, async (req, res) => {
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

router.post('/update', async (req, res) => {
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

router.post('/arrange', auth, async (req, res) => {
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

router.post('/finalized', auth, async (req, res) => {
    try {
        const gradeStructureId = req.body.gradeStructureId;
        const gradeStructure = await GradeStructure.findById(gradeStructureId);
        gradeStructure.finalized = 'finalized';
        await gradeStructure.save();
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Could not finalized.'
        });
    }
})

router.post('/unfinalized', auth, async (req, res) => {
    try {
        const gradeStructureId = req.body.gradeStructureId;
        const gradeStructure = await GradeStructure.findById(gradeStructureId);
        gradeStructure.finalized = 'unfinalized';
        await gradeStructure.save();
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Could not unfinalized.'
        });
    }
})

module.exports = router;