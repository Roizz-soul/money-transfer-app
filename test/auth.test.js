const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); // Replace with the path to your main app file

chai.use(chaiHttp);
const { expect } = chai;

const email = "user1@example.com";

describe("Authentication Tests", () => {
  it("should sign up a new user", async () => {
    const res = await chai.request(app).post("/auth/signup").send({
      email,
      password: "12345678",
      first_name: "User",
      last_name: "Test",
      phone: "0811111111",
    });

    expect(res).to.have.status(201);
    expect(res.body)
      .to.have.property("message")
      .eql("User created successfully.");
  });

  it("should log in an existing user", async () => {
    const res = await chai.request(app).post("/auth/login").send({
      email,
      password: "12345678",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });
});
