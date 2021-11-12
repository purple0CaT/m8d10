import jwt from "jsonwebtoken";
import UserSchema from "../user/schema.js";
import createHttpError from "http-errors";

export const JWTAuth = async (user) => {
  const accessToken = await generateToken({ _id: user._id });
  const refreshToken = await generateRefreshToken({ _id: user._id });
  return { accessToken, refreshToken };
};

// CREATE TOKENS
const generateToken = async (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) rej(err);
        else res(token);
      }
    )
  );
const generateRefreshToken = async (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_REFR_SECRET,
      { expiresIn: "1w" },
      (err, token) => {
        if (err) rej(err);
        else res(token);
      }
    )
  );
// TOKEN VERIFICATION
export const verifyJWT = async (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) rej(err);
      else res(decodedToken);
    })
  );
// REFRESH TOKEN VERIFICATION
export const verifyRefreshJWT = async (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_REFR_SECRET, (err, decodedToken) => {
      if (err) rej(err);
      else res(decodedToken);
    })
  );
// create NEW TOKENS USING REFRESH TOKEN
export const JWTRefreshAuth = async (refToken) => {
  const decodedToken = await verifyRefreshJWT(refToken);
  const user = await UserSchema.findById(decodedToken._id);
  if (!user) throw createHttpError(404, "User not found!");
  if (user.refreshToken === refToken) {
    const { accessToken, refreshToken } = await JWTauthenticate(user);
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } else {
    throw createHttpError(404, "False token");
  }
};
