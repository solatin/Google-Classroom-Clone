const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    name: {
        type: String
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    duration: {
        type: String
    },
    code: {
        type: String
    }
}, { collection: "Class" });

module.exports = mongoose.model("Class", ClassSchema);