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
