"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const passport_1 = __importDefault(require("passport"));
const schema_1 = __importDefault(require("../user/schema"));
const tokenAuth_1 = require("./tokenAuth");
//
process.env.TS_NODE_DEV && require("dotenv").config();
const loginRoute = express_1.default.Router();
loginRoute.post("/", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await schema_1.default.checkCredentials(email, password);
        if (user) {
            const { accessToken, refreshToken } = await (0, tokenAuth_1.JWTAuth)(user);
            res.status(200).send({ user, accessToken, refreshToken });
        }
        else {
            next((0, http_errors_1.default)(401, " Wrong credentials!"));
        }
    }
    catch (error) {
        next((0, http_errors_1.default)(500));
    }
});
//
loginRoute.get("/loginFB", passport_1.default.authenticate("facebook", { scope: "email" }));
loginRoute.get("/redirectFB", passport_1.default.authenticate("facebook"), async (req, res, next) => {
    try {
        res.cookie("accessToken", req.user.tokens.accessToken, {
            httpOnly: true,
            // secure: (process.env.NODE_ENV = "production" ? true : false),
            sameSite: "none",
        });
        res.cookie("refreshToken", req.user.tokens.refreshToken, {
            httpOnly: true,
            // secure: (process.env.NODE_ENV! = "production" ? true : false),
            sameSite: "none",
        });
        res.redirect("http://localhost:3000");
    }
    catch (error) {
        next((0, http_errors_1.default)(500));
    }
});
//
loginRoute.get("/loginGoogle", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
loginRoute.get("/redirectGoogle", passport_1.default.authenticate("google"), async (req, res, next) => {
    // console.log(req);
    try {
        res.cookie("accessToken", req.user.tokens.accessToken, {
            httpOnly: true,
            // secure: (process.env.NODE_ENV! = "production" ? true : false),
            sameSite: "none",
        });
        res.cookie("refreshToken", req.user.tokens.refreshToken, {
            httpOnly: true,
            // secure: (process.env.NODE_ENV! = "production" ? true : false),
            sameSite: "none",
        });
        res.redirect("http://localhost:3000");
    }
    catch (error) {
        console.log(error);
        next((0, http_errors_1.default)(500));
    }
});
exports.default = loginRoute;
