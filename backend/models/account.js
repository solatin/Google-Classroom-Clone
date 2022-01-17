const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    display_name: {
        type: String
    },
    mssv: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    refresh_token: {
        type: String
    },
    role: {
        type: String
    },
    status: {
        type: String
    }

}, { collection: "Account" });

module.exports = mongoose.model("Account", AccountSchema);