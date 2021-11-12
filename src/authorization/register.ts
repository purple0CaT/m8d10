import express from "express";
import createHttpError from "http-errors";
import UserSchema from "../user/schema";
import { JWTAuth } from "./tokenAuth";
//
process.env.TS_NODE_DEV && require("dotenv").config();
const registerRoute = express.Router();

registerRoute.post("/", async (req, res, next) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });
    if (!user) {
      const newUser = new UserSchema(req.body);
      const { accessToken, refreshToken } = await JWTAuth(newUser);
      newUser.refreshToken = refreshToken;
      const nUser = await newUser.save();
      //
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure: (process.env.NODE_ENV! = "production" ? true : false),
        sameSite: "none",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: (process.env.NODE_ENV! = "production" ? true : false),
        sameSite: "none",
      });
      res.status(201).send({ user: nUser, accessToken, refreshToken });
    } else {
      next(createHttpError(401, "User already exists or not valid credentials"));
    }
  } catch (error) {
    console.log(error);
    next(createHttpError(500, { error }));
  }
});

export default registerRoute;
