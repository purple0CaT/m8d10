import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import passport from "passport";
import accommodationRouter from "./accommodation/index";
import FBStrategy from "./authorization/facebook";
import googleStrategy from "./authorization/google";
import loginRoute from "./authorization/login";
import registerRoute from "./authorization/register";
import {
  catchAllHandler, generalErrHandl
} from "./errorHadlers";
import userRoute from "./user/user";

export const server = express();

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
// 
server.use(generalErrHandl);
server.use(catchAllHandler);
//
