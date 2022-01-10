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
        },
        finalized: {
            type: Boolean
        }
    },
    { collection: "GradeStructure" }
);

module.exports = mongoose.model("GradeStructure", GradeStructureSchema);