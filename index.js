if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//node modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const userRoutes = require("./routers/user");
const taskRoutes = require("./routers/task");

//mongoDB connection
let DB = "mongodb://127.0.0.1:27017/taskAppDB-test";
mongoose
  .connect(DB, {
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

//routers
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

module.exports = app;
