const jwt = require("jsonwebtoken");
const User = require("./models/user");

module.exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.decode(token, "avalidsecret");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    req.token = token;
    req.user = user;
    next();
  } catch {
    res.status(401).send("Error: Please login first.");
  }
};