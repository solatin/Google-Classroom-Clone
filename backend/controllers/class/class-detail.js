const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const auth = require('../../middlewares/auth');

const ClassStudent = require('../../models/class_student');
const ClassTeacher = require('../../models/class_teacher');
const Class = require('../../models/class.js');
const Account = require('../../models/account.js');

router.post('/feed', auth, async (req, res) => {
    try {
        const id = req.body.classId;
        const classroom = await Class.findById(id);
        const owner = await Account.findById(classroom.owner_id);
        const classData = { code: classroom.code, teacher_name: owner.display_name, id: id, name: classroom.name };

        res.json(classData);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Get failed'
        });
    }
});

router.post('/members', auth, async (req, res) => {
    const account = res.locals.account;
    const classroom = await Class.findById(req.body.classId);
    const listStudent = await ClassStudent.find({ code: classroom.code });
    const listStudentId = [];
    for (let index = 0; index < listStudent.length; index++) {
        const element = listStudent[index];
        listStudentId.push(mongoose.Types.ObjectId(element.student_id));
    }
    const listStudentInfo = await Account.find({ _id: { $in: listStudentId } });
    const listStudentRes = [];
    for (let index = 0; index < listStudent.length; index++) {
        const element = listStudent[index];
        listStudentRes.push({
            student_class_id: element.student_class_id,
            display_name: listStudentInfo[index].display_name,
            can_change: account.id === element.student_id
        });
    }
    const listTeacher = await ClassTeacher.find({ code: classroom.code });
    const listTeacherId = [];
    for (let index = 0; index < listTeacher.length; index++) {
        const element = listTeacher[index];
        listTeacherId.push(mongoose.Types.ObjectId(element.teacher_id));
    }
    const listTeacherRes = await Account.find({ _id: { $in: listTeacherId } });

    res.json({ listTeacher: listTeacherRes, listStudent: listStudentRes });
});

module.exports = router