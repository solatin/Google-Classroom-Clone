const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassSchema = new Schema(
  {
    name: {
      type: String
    },
    teacher_name: {
      type: String
    },
    duration: {
      type: String
    },
    code: {
      type: String
    }
  },
  { collection: "Class" }
);

module.exports = mongoose.model("Class", ClassSchema);