const app = require("../../app");
const supertest = require("supertest");
require("../mongodb_helper");
const User = require("../../models/user");
const JWT = require('jsonwebtoken');
const { decodeToken } = require("../../lib/token");

describe("/tokens", () => {
  beforeAll(async () => {
    const user = new User({
      email: "auth-test@test.com",
      password: "12345678",
      username: "someone",
    });

    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });
  describe("createToken method:", () => {
    test("returns a token when credentials are valid", async () => {
      const testApp = supertest(app);
      const response = await testApp.post("/tokens").send({
        email: "auth-test@test.com",
        password: "12345678",
        username: "someone",
      });

      expect(response.status).toEqual(201);
      expect(response.body.token).not.toEqual(undefined);
      expect(response.body.message).toEqual("Login successful.");
    });

    test("doesn't return a token when the user doesn't exist", async () => {
      const testApp = supertest(app);
      const response = await testApp.post("/tokens").send({
        email: "non-existent@test.com",
        password: "1234",
        username: "someone",
      });

      expect(response.status).toEqual(401);
      expect(response.body.token).toEqual(undefined);
      expect(response.body.message).toEqual("Please check your login details.");
    });

    test("doesn't return a token when the wrong password is given", async () => {
      const testApp = supertest(app);
      const response = await testApp.post("/tokens").send({
        email: "auth-test@test.com",
        password: "1234",
        username: "someone",
      });

      expect(response.status).toEqual(401);
      expect(response.body.token).toEqual(undefined);
      expect(response.body.message).toEqual("Please check your login details.");
    });
  });

  describe("refresh method:", () => {
    test("returns a token when 'refresh' token is valid", async () => {
      const testApp = supertest(app);
      const loginResponse = await testApp.post("/tokens").send({
        email: "auth-test@test.com",
        password: "12345678",
        username: "someone",
      });

      const cookies = loginResponse.headers["set-cookie"];

      const response = await testApp
        .post("/tokens/refresh")
        .set("Cookie", cookies)
        .send();

      expect(response.status).toEqual(201);
      expect(response.body.token).not.toEqual(undefined);
      expect(response.body.message).toEqual("Access token issued.");
    });
  });
  
  test("returns 401 when a cookie doesn't exist", async () => {
    const testApp = supertest(app);
    // const loginResponse = await testApp.post("/tokens").send({
    //   email: "auth-test@test.com",
    //   password: "12345678",
    //   username: "someone",
    // });

    const response = await testApp
    .post("/tokens/refresh")
    .send();

    expect(response.status).toEqual(401);
    expect(response.body.token).toEqual(undefined);
    expect(response.body.message).toEqual("Unauthorized");
  });

  test("returns 403 for expired 'refresh' token", async () => {
    const expiredToken = JWT.sign({ user_id: "validUserId" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '0s' }); 
    const testApp = supertest(app);

    const response = await testApp
    .post("/tokens/refresh")
    .set("Cookie", `jwt=${expiredToken}`)
    .send();

    expect(response.status).toEqual(403);
    expect(response.body.token).toEqual(undefined);
    expect(response.body.message).toEqual("Forbidden");
  }); 

  test("returns 403 for invalid 'refresh' token", async () => {
    const invalidtoken = "invalid.token"
    const testApp = supertest(app);

    const response = await testApp
    .post("/tokens/refresh")
    .set("Cookie", `jwt=${invalidtoken}`)
    .send();

    expect(response.status).toEqual(403);
    expect(response.body.token).toEqual(undefined);
    expect(response.body.message).toEqual("Forbidden");
  })

  test("returns 401 for non-existant user", async () => {
    const nonUserToken = JWT.sign({ user_id: "nonUserId" }, process.env.REFRESH_TOKEN_SECRET); 
    const testApp = supertest(app);

    const response = await testApp
    .post("/tokens/refresh")
    .set("Cookie", `jwt=${nonUserToken}`)
    .send();

    expect(response.status).toEqual(401);
    expect(response.body.token).toEqual(undefined);
    expect(response.body.message).toEqual("Unauthorized");
  })
});
