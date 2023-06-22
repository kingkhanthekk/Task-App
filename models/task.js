const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    default: "No name",
    trim: true,
    maxlength: 50,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);