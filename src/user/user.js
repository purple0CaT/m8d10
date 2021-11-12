import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import UserSchema from "./schema.js";
import { hostOnlyMiddleware } from "../authorization/hostMiddleware.js";
import { JWTAuthMiddleware } from "../authorization/token.js";
import { JWTAuth } from "../authorization/tokenAuth.js";

const userRoute = express.Router();

userRoute.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

userRoute.get(
  "/me/accommodation",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const getAccommodations = await accommodationSchema.find();

      res.send(getAccommodations);
    } catch (error) {
      next(error);
    }
  }
);

export default userRoute;
