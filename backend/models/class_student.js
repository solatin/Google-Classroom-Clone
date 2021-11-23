const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassStudentSchema = new Schema(
  {
    code: {
      type: String
    },
    student_id: {
      type: String
    }
  },
  { collection: "ClassStudent" }
);

module.exports = mongoose.model("ClassStudent", ClassStudentSchema);