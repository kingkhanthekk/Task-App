//node modules
const express = require("express");

//models
const Task = require("../models/task");

const { auth } = require("../middlewares");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", auth, async (req, res) => {
  const match = { owner: req.user._id };

  if (req.query.isComplete) match.isComplete = req.query.isComplete;

  const limit = parseInt(req.query.limit) || false;
  const skip = parseInt(req.query.skip) || false;
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  const tasks = await Task.find(match).limit(limit).skip(skip).sort(sort);

  if (tasks.length < 1) {
    return res.send("You have no task.");
  }
  res.status(200).send(tasks);
});

router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(401).send();
    res.status(200).send(task);
  } catch (e) {
    res.status(404).send("Task not found.");
  }
});

router.post("/", auth, async (req, res) => {
  const task = new Task(req.body);
  task.owner = req.user._id;
  await task.save();
  res.status(200).send(task);
});

router.put("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedChanges = ["title", "description", "isComplete"];
  const isAllowed = updates.every((update) => allowedChanges.includes(update));

  if (!isAllowed) {
    return res.status(400).send("Error: Invalid input.");
  }

  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  for (let update in updates) {
    task[update] = req.body[update];
  }
  await task.save();
  res.send(task);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    res.send(task);
  } catch {
    res.status(401).send();
  }

  // if (!task) return res.status(401).send();
});

module.exports = router;
