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
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username });

  if (!user) throw new Error("Unable to login.");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Unable to login.");

  return user;
};

module.exports = mongoose.model("User", userSchema);
