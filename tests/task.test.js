const app = require("../index");
const request = require("supertest");
const { task1, userID, user, user2, setUpDB } = require("./db");
const Task = require("../models/task");

beforeEach(setUpDB);

test("Should create a new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send({
      description: "ula la la",
    })
    .expect(200);

  //Assert
  const taskAssert = await Task.findById(response.body._id);
  expect(taskAssert).not.toBeNull();
});

test("Should get tasks of a user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert
  expect(response.body.length).toBe(2);
});

test("Should get a task of a user", async () => {
  const response = await request(app)
    .get(`/tasks/${task1._id}`)
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert
  expect(response.body).not.toBeNull();
});

test("Should not get a task of an unauthorized user", async () => {
  await request(app)
    .get(`/tasks/${task1._id}`)
    .set("Authorization", `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(401);
});

test("Should delete a task", async () => {
  await request(app)
    .delete(`/tasks/${task1._id}`)
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert
  const taskAssert = await Task.findById(task1._id);
  expect(taskAssert).toBeNull();
});

test("Should not delete a task for unauthorized user", async () => {
  await request(app)
    .delete(`/tasks/${task1._id}`)
    .set("Authorization", `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert
  const taskAssert = await Task.findById(task1._id);
  expect(taskAssert).not.toBeNull();
});
