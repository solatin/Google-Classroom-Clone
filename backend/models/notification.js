const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
    {
        user_id: {
            type: String
        },
        content: {
            type: String,
        },
        link: {
            type: String
        },
        status: {
            type: String
        },
    },
    { collection: "Notification" }
);

module.exports = mongoose.model("Notification", NotificationSchema);