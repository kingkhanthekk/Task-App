const app = require("../index");
const request = require("supertest");
const User = require("../models/user");
const { userID, user, setUpDB } = require("./db");

beforeEach(setUpDB);

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

test("Should upload an avatar for a user", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  //Assert
  const userAssert = await User.findById(userID);
  expect(userAssert.avatar).toEqual(expect.any(Buffer));
});

test("Should delete an user's avatar", async () => {
  await request(app)
    .delete("/users/me/avatar")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert
  const userAssert = await User.findById(userID);
  expect(userAssert.avatar).toBe(undefined);
});

test("Should update user information", async () => {
  await request(app)
    .put("/users/me")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send({
      username: "Fujitel",
    })
    .expect(200);

  const userAssert = await User.findById(userID);
  expect(userAssert.username).toBe("Fujitel");
});

test("Should not update unauthorized user information", async () => {
  await request(app)
    .put("/users/me")
    .send({
      username: "Fujitel",
      email: "hakka@bakka.com",
    })
    .expect(401);
});

test("Should logout a user", async () => {
  await request(app)
    .post("/users/logout")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert
  const userAssert = await User.findById(userID);
  expect(userAssert.tokens).not.toContain(user.tokens[0].token);
});

test("Should logout from all user sessions", async () => {
  await request(app)
    .post("/users/logoutAll")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert
  const userAssert = await User.findById(userID);
  expect(userAssert.tokens).toEqual([]);
});
