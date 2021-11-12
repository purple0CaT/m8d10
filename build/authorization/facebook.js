"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const tokenAuth_js_1 = require("./tokenAuth.js");
const schema_js_1 = __importDefault(require("../user/schema.js"));
//
const FBStrategy = new passport_facebook_1.default({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.B_URL}/login/redirectFB`,
}, async function (accessToken, refreshToken, profile, passNext) {
    const user = await schema_js_1.default.findOne({ fbId: profile.id });
    console.log(profile);
    if (user) {
        const tokens = await (0, tokenAuth_js_1.JWTAuth)(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        passNext(null, { tokens });
    }
    else {
        try {
            const newUser = {
                name: profile.name.givenName || profile.displayName.split(" ")[0],
                role: "user",
                fbId: profile.id,
                refreshToken: "",
            };
            const createdUser = new schema_js_1.default(newUser);
            const tokens = await (0, tokenAuth_js_1.JWTAuth)(createdUser);
            createdUser.refreshToken = tokens.refreshToken;
            await createdUser.save();
            passNext(null, { tokens });
        }
        catch (error) {
            passNext(null, { error });
        }
    }
});
//
passport_1.default.serializeUser(function (data, passNext) {
    passNext(null, data);
});
exports.default = FBStrategy;
