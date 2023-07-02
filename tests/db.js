const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");

const userID = new mongoose.Types.ObjectId();

const user = {
  _id: userID,
  username: "ajitel",
  email: "hawa@gmail.com",
  password: "amijinis",
  tokens: [
    {
      token: jwt.sign({ _id: userID.toString() }, process.env.JWT_SECRET),
    },
  ],
};

const setUpDB = async () => {
  await User.deleteMany({});
  await new User(user).save();
};

module.exports = {
  userID,
  user,
  setUpDB,
};
