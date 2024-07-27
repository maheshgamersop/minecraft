const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const save = new Schema({
  file: {
    type: String,
    required: true,
  }
})
module.exports = mongoose.model("save", save)