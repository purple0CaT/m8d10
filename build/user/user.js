"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hostMiddleware_js_1 = require("../authorization/hostMiddleware.js");
const token_js_1 = require("../authorization/token.js");
const userRoute = express_1.default.Router();
userRoute.get("/me", token_js_1.JWTAuthMiddleware, async (req, res, next) => {
    try {
        res.send(req.user);
    }
    catch (error) {
        next(error);
    }
});
userRoute.get("/me/accommodation", token_js_1.JWTAuthMiddleware, hostMiddleware_js_1.hostOnlyMiddleware, async (req, res, next) => {
    try {
        const getAccommodations = await accommodationSchema.find();
        res.send(getAccommodations);
    }
    catch (error) {
        next(error);
    }
});
exports.default = userRoute;
