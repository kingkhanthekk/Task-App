const app = require("../index");
const request = require("supertest");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userID = new mongoose.Types.ObjectId();

const user = {
  _id: userID,
  username: "ajitel",
  email: "hawa@gmail.com",
  password: "amijinis",
  tokens: [
    {
      token: jwt.sign({ _id: userID.toString() }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany({});
  await new User(user).save();
});

test("Should sign up a user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      username: "mojitel",
      email: "abulk690@gmail.com",
      password: "amijinis",
    })
    .expect(200);
  //Database assertions
  const user = await User.findById(response.body._id);
  expect(user).not.toBeNull();

  expect(user).toMatchObject({
    username: "mojitel",
    email: "abulk690@gmail.com",
  });
  expect(user.password).not.toBe("amijinis");
});

test("Should login a user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      username: user.username,
      password: user.password,
    })
    .expect(200);
});

test("Should fail to login an unauthorized user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      username: "amarnam",
      password: "istik",
    })
    .expect(400);
});

test("Should get profile for a user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should fail to get profile for unauthorized user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for a user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert user deleted
  const userDeleted = await User.findOne({ _id: user._id });
  expect(userDeleted).toBeNull();
});

test("Should not delete account for an unauthorized user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
