"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerRoute = express_1.default.Router();
registerRoute.post("/register", async (req, res, next) => {
    try {
        const user = await UserSchema.findOne({ email: req.body.email });
        if (!user) {
            const newUser = new UserSchema(req.body);
            const { accessToken, refreshToken } = await JWTAuth(newUser);
            newUser.refreshToken = refreshToken;
            const nUser = await newUser.save();
            //
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: (process.env.NODE_ENV = "production" ? true : false),
                sameSite: "none",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: (process.env.NODE_ENV = "production" ? true : false),
                sameSite: "none",
            });
            res.send({ nUser, accessToken, refreshToken });
        }
        else {
            next(createHttpError(401, "User already exists"));
        }
    }
    catch (error) {
        next(createHttpError(500));
    }
});
exports.default = registerRoute;
