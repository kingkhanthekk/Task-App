const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");
const Task = require("../models/task");

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

const user2ID = new mongoose.Types.ObjectId();

const user2 = {
  _id: user2ID,
  username: "uskitel",
  email: "hawa@gmail.com",
  password: "amijinis",
  tokens: [
    {
      token: jwt.sign({ _id: user2ID.toString() }, process.env.JWT_SECRET),
    },
  ],
};

const task1 = {
  _id: new mongoose.Types.ObjectId(),
  title: "Habi jabi",
  description: "Tasks",
  owner: userID,
};
const task2 = {
  _id: new mongoose.Types.ObjectId(),
  title: "Habi jabi",
  description: "Tasks",
  isComplete: true,
  owner: userID,
};
const task3 = {
  _id: new mongoose.Types.ObjectId(),
  title: "Habi jabi",
  description: "Tasks",
  owner: user2ID,
};

const setUpDB = async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await new User(user).save();
  await new User(user2).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
};

module.exports = {
  task1,
  task2,
  task3,
  userID,
  user,
  user2ID,
  user2,
  setUpDB,
};
