import express from "express";
import { hostOnlyMiddleware } from "../authorization/hostMiddleware.js";
import { JWTAuthMiddleware } from "../authorization/token.js";
import accommodationSchema from "./accommodationSchema.js";

import accommodation from "./accommodationSchema.js";

const accommodationRouter = express.Router();

accommodationRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const getAccommodations = await accommodationSchema.find().populate("host");

    res.send(getAccommodations);
  } catch (error) {
    next(error);
  }
});

accommodationRouter.get(
  "/:accMoId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const getAccommodations = await accommodationSchema.findById(
        req.params.accMoId
      );

      if (getAccommodations) {
        res.send(getAccommodations);
      } else {
        next(404, "Accommodation not found!");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

accommodationRouter.post(
  "/",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const createdAccommodation = await accommodationSchema.create({
        ...req.body,
        host: req.user._id,
      });

      res.send(createdAccommodation);
    } catch (error) {
      console.log(error);
    }
  }
);

export default accommodationRouter;
