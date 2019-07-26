const server = require("./routes.js");
const request = require("supertest");

describe("EndpointsTest", () => {
  it("Check to short password/username", () => {
    return request(server)
      .post("/api/register")
      .send({ username: "1234", password: "1234" })
      .expect("Content-Type", /json/)
      .expect(400);
  });

  it("check status on valid request", () => {
    return request(server)
      .post("/api/register")
      .send({ username: "12345", password: "12345" })
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
