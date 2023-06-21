//node modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//models
const User = require("./models/user");
const Task = require("./models/task");

//mongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/taskAppDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch(() => {
    console.log("Database error!");
  });

//app use methods
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//user routes
app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
});

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
});

app.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(user);
});

app.delete("/users/:id", async (req, res) => {
  const user = User.findByIdAndDelete(req.params.id);
  res.send(user);
});

//task routes
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find({});
  res.send(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.send(task);
});

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
});

app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const task = Task.findByIdAndDelete(req.params.id);
  res.send(task);
});

//app start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
