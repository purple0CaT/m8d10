import passport from "passport";
import FaceBookStrategy from "passport-facebook";
import { JWTAuth } from "./tokenAuth.js";
import UserSchema from "../user/schema.js";
//
const FBStrategy = new FaceBookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.B_URL}/login/redirectFB`,
  },
  async function (accessToken, refreshToken, profile, passNext) {
    const user = await UserSchema.findOne({ fbId: profile.id });
    console.log(profile);
    if (user) {
      const tokens = await JWTAuth(user);
      user.refreshToken = tokens.refreshToken;
      await user.save();
      passNext(null, { tokens });
    } else {
      try {
        const newUser = {
          name: profile.name.givenName || profile.displayName.split(" ")[0],
          role: "user",
          fbId: profile.id,
          refreshToken: "",
        };
        const createdUser = new UserSchema(newUser);
        const tokens = await JWTAuth(createdUser);
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

export default FBStrategy;
