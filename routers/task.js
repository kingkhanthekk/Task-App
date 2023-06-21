//node modules
const express = require("express");

//models
const Task = require("../models/task");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  const tasks = await Task.find({});
  res.send(tasks);
});

router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.send(task);
});

router.post("/", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
});

router.put("/:id", async (req, res) => {
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
