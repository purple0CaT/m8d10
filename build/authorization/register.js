"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const schema_1 = __importDefault(require("../user/schema"));
const tokenAuth_1 = require("./tokenAuth");
//
process.env.TS_NODE_DEV && require("dotenv").config();
const registerRoute = express_1.default.Router();
registerRoute.post("/", async (req, res, next) => {
    try {
        const user = await schema_1.default.findOne({ email: req.body.email });
        if (!user) {
            const newUser = new schema_1.default(req.body);
            const { accessToken, refreshToken } = await (0, tokenAuth_1.JWTAuth)(newUser);
            newUser.refreshToken = refreshToken;
            const nUser = await newUser.save();
            //
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                // secure: (process.env.NODE_ENV! = "production" ? true : false),
                sameSite: "none",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                // secure: (process.env.NODE_ENV! = "production" ? true : false),
                sameSite: "none",
            });
            res.status(201).send({ user: nUser, accessToken, refreshToken });
        }
        else {
            next((0, http_errors_1.default)(401, "User already exists or not valid credentials"));
        }
    }
    catch (error) {
        console.log(error);
        next((0, http_errors_1.default)(500, { error }));
    }
});
exports.default = registerRoute;
