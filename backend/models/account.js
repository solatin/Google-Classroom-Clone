const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    display_name: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    }
  },
  { collection: "Account" }
);

module.exports = mongoose.model("Account", AccountSchema);