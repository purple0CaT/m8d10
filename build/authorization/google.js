"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const schema_1 = __importDefault(require("../user/schema"));
const tokenAuth_1 = require("./tokenAuth");
dotenv_1.default.config();
//
const googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.B_URL}/login/redirectGoogle`,
}, async function (accessToken, refreshToken, profile, passNext) {
    const user = await schema_1.default.findOne({ googleId: profile.id });
    if (user) {
        const tokens = await (0, tokenAuth_1.JWTAuth)(user);
        console.log("True user", tokens);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        passNext(null, { tokens });
    }
    else {
        try {
            const newUser = {
                name: profile.displayName,
                role: "User",
                googleId: profile.id,
                refreshToken: "",
            };
            const createdUser = new schema_1.default(newUser);
            const tokens = await (0, tokenAuth_1.JWTAuth)(createdUser);
            console.log("False user", tokens);
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
exports.default = googleStrategy;
