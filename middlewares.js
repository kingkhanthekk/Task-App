const jwt = require("jsonwebtoken");
const User = require("./models/user");

module.exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("No user found.");
    }
    req.token = token;
    req.user = user;
    next();
  } catch {
    res.status(401).send("Error: Please login first.");
  }
};
