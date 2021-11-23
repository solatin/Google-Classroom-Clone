const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassTeacherSchema = new Schema(
    {
        code: {
            type: String
        },
        teacher_id: {
            type: String
        },
    },
    { collection: "ClassTeacher" }
);

module.exports = mongoose.model("ClassTeacher", ClassTeacherSchema);