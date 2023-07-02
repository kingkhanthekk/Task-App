const app = require("../index");
const request = require("supertest");
const { userID, user, setUpDB } = require("./db");
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
