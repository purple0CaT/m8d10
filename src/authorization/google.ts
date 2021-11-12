import dotenv from "dotenv";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import UserSchema from "../user/schema";
import { JWTAuth } from "./tokenAuth";
dotenv.config();

//
const googleStrategy = new Strategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID!,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET!,
    callbackURL: `${process.env.B_URL}/login/redirectGoogle`,
  },
  async function (accessToken, refreshToken, profile, passNext) {
    const user = await UserSchema.findOne({ googleId: profile.id });
    if (user) {
      const tokens = await JWTAuth(user);
      console.log("True user", tokens);
      user.refreshToken = tokens.refreshToken;
      await user.save();
      passNext(null, { tokens });
    } else {
      try {
        const newUser = {
          name: profile.displayName,
          role: "User",
          googleId: profile.id,
          refreshToken: "",
        };
        const createdUser = new UserSchema(newUser);
        const tokens = await JWTAuth(createdUser);
        console.log("False user", tokens);

        createdUser.refreshToken = tokens.refreshToken;
        await createdUser.save();
        passNext(null, { tokens });
      } catch (error) {
        passNext(null, { error });
      }
    }
  }
);
//
passport.serializeUser(function (data, passNext) {
  passNext(null, data);
});

export default googleStrategy;
