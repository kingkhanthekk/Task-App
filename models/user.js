const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new Schema(
  {
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
    avatar: Buffer,
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.post("findOneAndDelete", async function (user) {
  if (user) {
    await Task.deleteMany({ owner: user._id });
  }
});

userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username });

  if (!user) throw new Error("Unable to login.");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Unable to login.");

  return user;
};

userSchema.methods.tokenGenerate = async function () {
  const token = await jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET
  );
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

module.exports = mongoose.model("User", userSchema);
