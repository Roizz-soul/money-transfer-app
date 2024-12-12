const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);
const { expect } = chai;

describe("Transaction Tests", () => {
  it("should retrieve transaction history", async () => {
    const res = await chai
      .request(app)
      .get("/transactions")
      .set("Authorization", "Bearer <your-jwt-token>");

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });
});
