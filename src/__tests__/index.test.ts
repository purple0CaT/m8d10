import dotenv from "dotenv";
import mongoose from "mongoose";
import supertest from "supertest";
import { server } from "../app";
import jwt from "jsonwebtoken";
dotenv.config();

const request = supertest(server);
//

describe("Testing the testing environment", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});
//
describe("Authorization endpoints", () => {
  //
  beforeAll((done) => {
    mongoose.connect(process.env.MONGO_TEST_URL!).then(() => {
      console.log("Connected to Mongo 🍁");
      done();
    });
  });
  //
  const validCredentials = {
    name: "Testy",
    email: "hello@mail.com",
    password: "1234qwer",
    role: "host",
  };
  //
  it("Register: with a valid request =>  201 and Token's", async () => {
    const res = await request.post("/register").send(validCredentials);
    // console.log(res.body);
    const { _id } = jwt.verify(
      res.body.accessToken,
      process.env.JWT_SECRET!
    ) as any as { _id: string };
    expect(_id).toBe(res.body.user._id);
    expect(res.status).toBe(201);
  });
  it("Login: with a valid request =>  200 and valid Token", async () => {
    const res = await request.post("/login").send(validCredentials);
    // console.log(res.body);
    const { _id } = jwt.verify(
      res.body.accessToken,
      process.env.JWT_SECRET!
    ) as any as { _id: string };
    expect(res.status).toBe(200);
    expect(_id).toBe(res.body.user._id);
  });
  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        return mongoose.connection.close();
      })
      .then(() => done());
  });
});
//
describe("Resource Endpoints", () => {
  beforeAll((done) => {
    mongoose.connect(process.env.MONGO_TEST_URL!).then(() => {
      console.log("Connected to Mongo 🍁");
      done();
    });
  });
  const validCredentials = {
    name: "Testy",
    email: "hello@mail.com",
    password: "1234qwer",
    role: "host",
  };
  //
  it("Guests and hosts allowed: GET /accommodation =>  returned body should be an array", async () => {
    const regUsr = await request.post("/register").send(validCredentials);
    const res = await request
      .get("/accommodation")
      .set({ Authorization: `Bearer ${regUsr.body.accessToken}` });
    console.log(res.body);
    expect(res.body).toBe(Array);
  });
  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        return mongoose.connection.close();
      })
      .then(() => done());
  });
});
