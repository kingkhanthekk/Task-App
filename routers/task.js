//node modules
const express = require("express");

//models
const Task = require("../models/task");

const { auth } = require("../middlewares");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).send(tasks);
});

router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id).populate("owner");
  res.status(200).send(task);
});

router.post("/", auth, async (req, res) => {
  const task = new Task(req.body);
  task.owner = req.user._id;
  await task.save();
  res.status(200).send(task);
});

router.put("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedChanges = ["title", "description", "isComplete"];
  const isAllowed = updates.every((update) => allowedChanges.includes(update));

  if (!isAllowed) {
    return res.status(400).send("Error: Invalid input.");
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(task);
});

router.delete("/:id", async (req, res) => {
  const task = Task.findByIdAndDelete(req.params.id);
  res.send(task);
});

module.exports = router;
