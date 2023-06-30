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
mongoose
  .connect("mongodb://127.0.0.1:27017/taskAppDB", {
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

//app start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
