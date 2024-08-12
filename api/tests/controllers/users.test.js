const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email, password and username are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app).post("/users").send({
        email: "poppy@email.com",
        password: "1234",
        username: "someone",
      });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created and the password is hashed", async () => {
      const password = "1234";

      await request(app).post("/users").send({
        email: "scarconstt@email.com",
        password: password,
        username: "someone",
      });

      const users = await User.find();
      const newUser = users[users.length - 1];
      const passwordMatch = await bcrypt.compare(password, newUser.password);
      
      expect(newUser.email).toEqual("scarconstt@email.com");
      expect(passwordMatch).toBe(true);
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app).post("/users").send({
        email: "skye@email.com",
        username: "someone",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("All fields are required.");
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({
        email: "skye@email.com",
        username: "someone",
      });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app).post("/users").send({
        password: "1234",
        username: "someone",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("All fields are required.");
    });

    test("does not create a user", async () => {
      await request(app)
        .post("/users")
        .send({ password: "1234", username: "someone" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when username is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com", password: "1234" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual("All fields are required.");
    });

    test("does not create a user", async () => {
      await request(app)
        .post("/users")
        .send({ email: "skye@email.com", password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST: when a user already exists", () => {
    test("response code is 409", async () => {
      await request(app).post("/users").send({
        email: "scarconstt@email.com",
        password: "1234",
        username: "someone",
      });

      const response = await request(app).post("/users").send({
        email: "scarconstt@email.com",
        password: "1234",
        username: "someone",
      });

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe("Username or email already exists.");
    });
    test("does not create the user a second time", async () => {
      await request(app).post("/users").send({
        email: "scarconstt@email.com",
        password: "1234",
        username: "someone",
      });

      await request(app).post("/users").send({
        email: "scarconstt@email.com",
        password: "1234",
        username: "someone",
      });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST: when invalid data is sent", () => {
    test("response code is 400", async () => {
      const response = await request(app).post("/users").send({
        email: 1234,
        password: "1324",
        username: 1234,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid user data received.");
    });
    test("does not create a user", async () => {
      await request(app).post("/users").send({
        email: "scarconstt@email.com",
        password: "1324",
        username: 1234,
      });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });
});
