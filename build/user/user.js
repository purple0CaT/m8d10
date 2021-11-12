"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accommodationSchema_1 = __importDefault(require("../accommodation/accommodationSchema"));
const hostMiddleware_1 = require("../authorization/hostMiddleware");
const token_1 = require("../authorization/token");
const userRoute = express_1.default.Router();
userRoute.get("/me", token_1.JWTAuthMiddleware, async (req, res, next) => {
    try {
        res.send(req.user);
    }
    catch (error) {
        next(error);
    }
});
userRoute.get("/me/accommodation", token_1.JWTAuthMiddleware, hostMiddleware_1.hostOnlyMiddleware, async (req, res, next) => {
    try {
        const getAccommodations = await accommodationSchema_1.default.find();
        res.send(getAccommodations);
    }
    catch (error) {
        next(error);
    }
});
exports.default = userRoute;
