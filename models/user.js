const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain the word 'password'");
      }
    },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const password = this.password;
    const hash = bcrypt.hash(password, 12);
    this.password = hash;
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
