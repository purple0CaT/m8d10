import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import supertest from "supertest";
import { server } from "../app";
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
      console.log("Connected to Mongo 2-times 🍁");
      done();
    });
  });
  //============================
  const validCredentials = {
    name: "Testy",
    email: "hello@mail.com",
    password: "1234qwer",
    role: "host",
  };
  const validAccomodation = {
    name: "Testy",
    city: "TestYork",
  };
  let token = "";
  //============================
  it("Guests and hosts allowed: GET /accommodation =>  returned body should be an array", async () => {
    const regUsr = await request.post("/register").send(validCredentials);
    token = regUsr.body.accessToken;
    const res = await request
      .get("/accommodation")
      .set({ Authorization: `Bearer ${token}` });
    expect(Array.isArray(res.body)).toBe(true);
  });
  it("Guests and hosts allowed: GET /accommodation/:id =>  returned accommodation id should match with req.params.id, should return 404 if not existing", async () => {
    const regUsr = await request
      .post("/accommodation")
      .send(validAccomodation)
      .set({ Authorization: `Bearer ${token}` });
    // console.log(regUsr.body);
    const res = await request
      .get(`/accommodation/${regUsr.body._id}`)
      .set({ Authorization: `Bearer ${token}` });
    expect(res.body._id).toBe(regUsr.body._id);
    // console.log(res.body._id);
    const err = await request
      .get(`/accommodation/618e887ef830db835bedcf00`)
      .set({ Authorization: `Bearer ${token}` });
    // console.log(err.error);
    expect(err.status).toBe(404);
  });
  it("Guests and hosts allowed: GET /user/me =>  should return your user information without the password", async () => {
    const user = await request
      .get("/user/me")
      .set({ Authorization: `Bearer ${token}` });
    // console.log(user.body.password);
    expect(typeof user.body.password).toBe("undefined");
  });
  //============================
  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        return mongoose.connection.close();
      })
      .then(() => done());
  });
});
// =================================================   Resource Endpoints
describe("Resource Endpoints | Hosts only", () => {
  beforeAll((done) => {
    mongoose.connect(process.env.MONGO_TEST_URL!).then(() => {
      console.log("Connected to Mongo 3-times 🍁");
      done();
    });
  });
  //============================
  const validCredentials = {
    name: "Testy",
    email: "hello@mail.com",
    password: "1234qwer",
    role: "host",
  };
  const validAccomodation = {
    name: "Testy",
    city: "TestYork",
  };
  let token = "";
  //============================
  //   it("GHosts allowed: GET /accommodation =>  returned body should be an array", async () => {
  //     const regUsr = await request.post("/register").send(validCredentials);
  //     token = regUsr.body.accessToken;
  //     const res = await request
  //       .get("/accommodation")
  //       .set({ Authorization: `Bearer ${token}` });
  //     expect(Array.isArray(res.body)).toBe(true);
  //   });
  //
  it("Hosts allowed: GET /user/me/accommodation =>  body=array; host Id == user id in JWT token", async () => {
    const regUsr = await request.post("/register").send(validCredentials);
    token = regUsr.body.accessToken;

    const regAcc = await request
      .post("/accommodation")
      .send(validAccomodation)
      .set({ Authorization: `Bearer ${token}` });
    const regAcc2 = await request
      .post("/accommodation")
      .send(validAccomodation)
      .set({ Authorization: `Bearer ${token}` });
    // accom BODY
    const accomodation = await request
      .get("/user/me/accommodation")
      .set({ Authorization: `Bearer ${token}` });
    // jwt
    const { _id } = jwt.verify(token, process.env.JWT_SECRET!) as any as {
      _id: string;
    };
    // =
    expect(Array.isArray(accomodation.body)).toBe(true);
    expect(accomodation.body.some((a: any) => a.host[0] == _id)).toBe(true);
  });
  it("Hosts allowed:  POST /accommodation =>  200 if ok or 400 with invalid accommodation data", async () => {
    const regAcc = await request
      .post("/accommodation")
      .send(validAccomodation)
      .set({ Authorization: `Bearer ${token}` });
    expect(regAcc.status).toBe(200);
    // Error
    const errAcc = await request
      .post("/accommodation")
      .send({ name: "test" })
      .set({ Authorization: `Bearer ${token}` });
    expect(errAcc.status).toBe(400);
  });
  it("Hosts allowed:  PUT /accommodation/:id =>  204 if ok or 404if not exists", async () => {
    const regAcc = await request
      .post("/accommodation")
      .send(validAccomodation)
      .set({ Authorization: `Bearer ${token}` });
    // console.log(regAcc.body);
    const putResp = await request
      .put(`/accommodation/${regAcc.body._id}`)
      .send({
        name: "Not Testy!",
        city: "TestYork",
      })
      .set({ Authorization: `Bearer ${token}` });
    // console.log(putResp.body);
    expect(putResp.status).toBe(204);
  });
  //============================
  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        return mongoose.connection.close();
      })
      .then(() => done());
  });
});
