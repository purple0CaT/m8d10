import jwt from "jsonwebtoken";
import UserSchema from "../user/schema";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import { UserType } from "../types/types.js";
process.env.TS_NODE_DEV && require("dotenv").config();

export const JWTAuth = async (user: UserType) => {
  const accessToken = await generateToken({ _id: user._id });
  const refreshToken = await generateRefreshToken({ _id: user._id });
  return { accessToken, refreshToken };
};

// CREATE TOKENS
const generateToken = async (payload: { _id: string }) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) rej(err);
        else res(token);
      }
    )
  );
const generateRefreshToken = async (payload: { _id: string }) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_REFR_SECRET!,
      { expiresIn: "1w" },
      (err, token) => {
        if (err) rej(err);
        else res(token);
      }
    )
  );
// TOKEN VERIFICATION
export const verifyJWT = async (token: string) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err) rej(err);
      else res(decodedToken);
    })
  );
// REFRESH TOKEN VERIFICATION
export const verifyRefreshJWT = async (token: string) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_REFR_SECRET!, (err, decodedToken) => {
      if (err) rej(err);
      else res(decodedToken);
    })
  );
// create NEW TOKENS USING REFRESH TOKEN
export const JWTRefreshAuth = async (refToken: string) => {
  const decodedToken: UserType | any = await verifyRefreshJWT(refToken);
  const user = await UserSchema.findById(decodedToken._id);
  if (!user) throw createHttpError(404, "User not found!");
  if (user.refreshToken === refToken) {
    const { accessToken, refreshToken } = await JWTAuth(user);
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } else {
    throw createHttpError(404, "False token");
  }
};
