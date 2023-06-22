//node modules
const express = require("express");

//models
const User = require("../models/user");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.authenticate(username, password);
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedChanges = ["username", "email", "password"];
  const isAllowed = updates.every((update) => {
    return allowedChanges.includes(update);
  });
  if (!isAllowed) {
    return res.status(400).send("Error: Invalid Request.");
  }

  const user = await User.findById(req.params.id);
  for (let update of updates) {
    user[update] = req.body[update];
  }
  await user.save();
  res.status(200).send(user);
});

router.delete("/:id", async (req, res) => {
  const user = User.findByIdAndDelete(req.params.id);
  res.status(200).send(user);
});

module.exports = router;
