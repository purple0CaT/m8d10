import express from "express";
import createHttpError from "http-errors";
import { hostOnlyMiddleware } from "../authorization/hostMiddleware";
import { JWTAuthMiddleware } from "../authorization/token";
import accommodationSchema from "./accommodationSchema";
//
//

const accommodationRouter = express.Router();

accommodationRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const getAccommodations = await accommodationSchema.find().populate("host");

    res.send(getAccommodations);
  } catch (error) {
    next(createHttpError(500));
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
        next(createHttpError(404, "Accommodation not found!"));
      }
    } catch (error) {
      next(createHttpError(500));
    }
  }
);

accommodationRouter.post(
  "/",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: any, res, next) => {
    try {
      const createdAccommodation = await accommodationSchema.create({
        ...req.body,
        host: req.user._id,
      });

      res.send(createdAccommodation);
    } catch (error) {
      // console.log(error);
      next(createHttpError(500));
    }
  }
);

export default accommodationRouter;
