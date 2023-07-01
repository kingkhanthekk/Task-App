const app = require("../index");
const request = require("supertest");

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
