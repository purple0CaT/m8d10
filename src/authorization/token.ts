import { NextFunction } from "express";
import createHttpError from "http-errors";
import { UserType } from "../types/types.js";
import UserModel from "../user/schema";
import { verifyJWT } from "./tokenAuth";

export const JWTAuthMiddleware = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please Provide credentials"));
  } else {
    try {
      const token: string = req.headers.authorization.replace("Bearer ", "");

      const decodeToken: any | UserType = await verifyJWT(token);

      const findUserById = await UserModel.findById(decodeToken._id);

      if (findUserById) {
        req.user = findUserById;
        next();
      } else {
        next(createHttpError(401, "User not found!"));
      }
    } catch (error) {
      next(createHttpError(401, "Token not valid!"));
    }
  }
};
