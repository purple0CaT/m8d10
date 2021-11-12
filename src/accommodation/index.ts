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
    // console.log(req.params.accMoId);
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
      // console.log(createdAccommodation);
      res.send(createdAccommodation);
    } catch (error) {
      // console.log(error);
      next(createHttpError(400, "Wrong accomodations"));
    }
  }
);
accommodationRouter.put(
  "/:accMoId",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: any, res, next) => {
    try {
      const updateAcc = await accommodationSchema.findByIdAndUpdate(
        req.params.accMoId,
        req.body,
        { new: true }
      );
      // console.log(updateAcc);
      res.status(204).send(updateAcc);
    } catch (error) {
      // console.log(error);
      next(createHttpError(404, "Wrong accomodations"));
    }
  }
);
accommodationRouter.delete(
  "/:accMoId",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: any, res, next) => {
    try {
      const updateAcc = await accommodationSchema.findByIdAndDelete(
        req.params.accMoId
      );
      // console.log(updateAcc);
      res.status(204).send();
    } catch (error) {
      // console.log(error);
      next(createHttpError(404, "Wrong accomodations"));
    }
  }
);

export default accommodationRouter;
