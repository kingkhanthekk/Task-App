//node modules
const express = require("express");

//models
const User = require("../models/user");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
});

router.post("/", async (req, res) => {
  const user = new User(req.body);
  await user.save();
});

router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = User.findByIdAndDelete(req.params.id);
  res.send(user);
});

module.exports = router;
