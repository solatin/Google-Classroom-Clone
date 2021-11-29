const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GradeStructureSchema = new Schema(
    {
        class_id: {
            type: String
        },
        title: {
            type: String,
        },
        grade: {
            type: String
        },
        position: {
            type: Number
        }
    },
    { collection: "ClassStudent" }
);

module.exports = mongoose.model("GRadeStructure", GradeStructureSchema);