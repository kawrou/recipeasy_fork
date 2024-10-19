const loginLimiter = require("../../src/middleware/loginLimiter");
const express = require("express");
const supertest = require("supertest");

describe("login limiter test", () => {
  let app;
  let testApp;
  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.post("/", loginLimiter, (req, res) => {
      return res.status(201).json({ message: "Login successful." });
    });

    testApp = supertest(app);
  });
//   it("should allow log in requests up to limit", async () => {
//     await testApp.post("/").expect(201);
//     await testApp.post("/").expect(201);
//     await testApp.post("/").expect(201);
//     await testApp.post("/").expect(201);
//     await testApp.post("/").expect(201);
//   });

  it("returns error when too many login attempts are made", async () => {
    for (let i = 1; i < 6; i++) {
      await testApp.post("/").expect(201);
    }

    const response = await testApp.post("/").expect(429);
    expect(response.body.message).toBe(
      "Too many login attempts. Please try again later."
    );
  });
});
