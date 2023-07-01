const app = require("../index");
const request = require("supertest");
const User = require("../models/user");

const user = {
  username: "ajitel",
  email: "abulk690@gmail.com",
  password: "amijinis",
};

beforeEach(async () => {
  await User.deleteMany({});
  await new User(user).save();
});

test("Should sign up a user", async () => {
  await request(app)
    .post("/users")
    .send({
      username: "mojitel",
      email: "abulk690@gmail.com",
      password: "amijinis",
    })
    .expect(200);
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

test("Should fail to login a user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      username: "amarnam",
      password: "istik",
    })
    .expect(400);
});
