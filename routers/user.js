//node modules
const express = require("express");
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("You must upload jpg, jpeg, or png files."));
    }

    // if (!file.originalname.match(/\.(doc|docx)$/)) {
    //   cb(new Error("Upload a document file."));
    // }

    cb(undefined, true);
  },
});

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

//Profile photo upload
router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send(err.message);
  }
);

//Multiple file upload with uploading count
// router.post("/me/avatar", upload.array("avatar", 1), (req, res) => {
//   res.send();
// });

router.put("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedChanges = ["username", "email", "password"];
  const isAllowed = updates.every((update) => {
    return allowedChanges.includes(update);
  });
  if (!isAllowed) {
    return res.status(400).send("Error: Invalid Request.");
  }

  for (let update of updates) {
    req.user[update] = req.body[update];
  }
  await req.user.save();
  res.status(200).send(user);
});

router.delete("/me", auth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  res.status(200).send(user);
});

router.delete("/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

module.exports = router;
