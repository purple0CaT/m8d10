import express from "express";
import accommodationSchema from "../accommodation/accommodationSchema";
import { hostOnlyMiddleware } from "../authorization/hostMiddleware";
import { JWTAuthMiddleware } from "../authorization/token";

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
