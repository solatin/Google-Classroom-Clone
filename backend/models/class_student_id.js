const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassStudentIdSchema = new Schema(
    {
        class_id: {
            type: String
        },
        student_class_id: {
            type: String
        },
        student_name: {
            type: String
        },
        status: {
            type: Boolean
        }
    },
    { collection: "ClassStudentId" }
);

module.exports = mongoose.model("ClassStudentId", ClassStudentIdSchema);