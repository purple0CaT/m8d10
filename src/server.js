import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import passport from "passport";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import accommodationRouter from "./accommodation/index.js";
import {
  catchAllHandler,
  forbiddenHandler,
  unauthorizedHandler,
} from "./errorHadlers.js";
import FBStrategy from "./authorization/facebook.js";
import googleStrategy from "./authorization/google.js";
import loginRoute from "./authorization/login.js";
import registerRoute from "./authorization/register.js";
import userRoute from "./user/user.js";

const server = express();

const port = process.env.PORT || 3003

//***********MIDDLEWARES ********************** */
passport.use("facebook", FBStrategy);
passport.use("google", googleStrategy);

server.use(cors());
server.use(express.json());
server.use(cookieParser());
server.use(passport.initialize());

//************Router ****************
// server.use("/auth", authorizRoute);

server.use("/user", userRoute);
server.use("/login", loginRoute);
server.use("/register", registerRoute);

server.use("/accommodation", accommodationRouter);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);
//
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to mongoDB 🚀");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server 🚀 > ", port);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("Mongo ERROR", err);
});

server.on("error", (err) => {
  console.error("Server crashed due to ", err);
});
