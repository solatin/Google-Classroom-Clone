const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassStudentGradeSchema = new Schema(
    {
        class_id: {
            type: String
        },
        student_class_id: {
            type: String
        },
        student_grade: {
            type: String
        },
        grade_structure_id: {
            type: String
        },
        status: {
            type: Boolean
        }
    },
    { collection: "ClassStudentGrade" }
);

module.exports = mongoose.model("ClassStudentGrade", ClassStudentGradeSchema);