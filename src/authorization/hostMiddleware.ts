import { NextFunction } from "express";
import createHttpError from "http-errors";

export const hostOnlyMiddleware = (req: any, res: any, next: NextFunction) => {
  if (req.user.role === "host") {
    next();
  } else {
    next(createHttpError(403, "Only Host"));
  }
};
