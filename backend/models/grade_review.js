const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GradeReviewSchema = new Schema(
	{
		student_class_id: {
			type: String
		},
		student_grade: {
			type: String
		},
		grade_structure_id: {
			type: String
		},
		comment: [{ type: Object }],
		status: {
			type: String
		}
	},
	{ collection: "GradeReview" }
);

module.exports = mongoose.model("GradeReview", GradeReviewSchema);