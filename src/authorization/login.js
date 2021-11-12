import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
const loginRoute = express.Router();

loginRoute.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.checkCred(email, password);
    if (user) {
      const { accessToken, refreshToken } = await JWTAuth(user);
      res.send({ user, accessToken, refreshToken });
    } else {
      next(createHttpError(404, " Wrong credentials!"));
    }
  } catch (error) {
    next(createHttpError(500));
  }
});
loginRoute.get(
  "/loginFB",
  passport.authenticate("facebook", { scope: "email" })
);
loginRoute.get(
  "/redirectFB",
  passport.authenticate("facebook"),
  async (req, res, next) => {
    try {
      res.cookie("accessToken", req.user.tokens.accessToken, {
        httpOnly: true,
        secure: (process.env.NODE_ENV = "production" ? true : false),
        sameSite: "none",
      });
      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        secure: (process.env.NODE_ENV = "production" ? true : false),
        sameSite: "none",
      });
      res.redirect("http://localhost:3000");
    } catch (error) {
      next(createHttpError(500));
    }
  }
);
loginRoute.get(
  "/loginGoogle",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
loginRoute.get(
  "/redirectGoogle",
  passport.authenticate("google"),
  async (req, res, next) => {
    // console.log(req);
    try {
      res.cookie("accessToken", req.user.tokens.accessToken, {
        httpOnly: true,
        secure: (process.env.NODE_ENV = "production" ? true : false),
        sameSite: "none",
      });
      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        secure: (process.env.NODE_ENV = "production" ? true : false),
        sameSite: "none",
      });
      res.redirect("http://localhost:3000");
    } catch (error) {
      console.log(error);
      next(createHttpError(500));
    }
  }
);
export default loginRoute;
