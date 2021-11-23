const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    student_name: {
        type: String
    },
    duration: {
        type: String
    },
    code: {
        type: String
    }
}, { collection: "ClassMember" });

module.exports = mongoose.model("ClassMember", ClassSchema);