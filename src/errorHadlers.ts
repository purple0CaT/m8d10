import { NextFunction, Request, Response } from "express";

export const generalErrHandl = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status >= 400 && err.status < 500) {
    res.status(err.status).send({
      status: "error",
      message: err.message || "Error!",
    });
  } else {
    next(err);
  }
};

export const catchAllHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  res.status(500).send({ status: "error", message: "Generic Server Error" });
};
