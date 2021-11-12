import createHttpError from "http-errors";
import userModel from "../user/schema.js";
import { verifyJWT } from "./tokenAuth.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please Provide credentials"));
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");

      const decodeToken = await verifyJWT(token);

      const findUserById = await userModel.findById(decodeToken._id);

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
