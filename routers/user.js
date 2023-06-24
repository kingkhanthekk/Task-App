//node modules
const express = require("express");

//models
const User = require("../models/user");

//middlewares
const { auth } = require("../middlewares");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  const user = new User(req.body);
  const token = await user.tokenGenerate();
  user.tokens.push({ token });
  await user.save();
  res.send(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.authenticate(username, password);
    const token = await user.tokenGenerate();
    user.tokens.concat({ token });
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.status(200).send("Successfully logged out");
  } catch {
    res.status(500).send("Something went wrong.");
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Logged out from all sessions.");
  } catch {
    res.status(500).send("Something went wrong");
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
