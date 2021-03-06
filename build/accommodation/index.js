"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const hostMiddleware_1 = require("../authorization/hostMiddleware");
const token_1 = require("../authorization/token");
const accommodationSchema_1 = __importDefault(require("./accommodationSchema"));
//
//
const accommodationRouter = express_1.default.Router();
accommodationRouter.get("/", token_1.JWTAuthMiddleware, async (req, res, next) => {
    try {
        const getAccommodations = await accommodationSchema_1.default.find().populate("host");
        res.send(getAccommodations);
    }
    catch (error) {
        next((0, http_errors_1.default)(500));
    }
});
accommodationRouter.get("/:accMoId", token_1.JWTAuthMiddleware, async (req, res, next) => {
    // console.log(req.params.accMoId);
    try {
        const getAccommodations = await accommodationSchema_1.default.findById(req.params.accMoId);
        if (getAccommodations) {
            res.send(getAccommodations);
        }
        else {
            next((0, http_errors_1.default)(404, "Accommodation not found!"));
        }
    }
    catch (error) {
        next((0, http_errors_1.default)(500));
    }
});
accommodationRouter.post("/", token_1.JWTAuthMiddleware, hostMiddleware_1.hostOnlyMiddleware, async (req, res, next) => {
    try {
        const createdAccommodation = await accommodationSchema_1.default.create({
            ...req.body,
            host: req.user._id,
        });
        // console.log(createdAccommodation);
        res.send(createdAccommodation);
    }
    catch (error) {
        // console.log(error);
        next((0, http_errors_1.default)(400, "Wrong accomodations"));
    }
});
accommodationRouter.put("/:accMoId", token_1.JWTAuthMiddleware, hostMiddleware_1.hostOnlyMiddleware, async (req, res, next) => {
    try {
        const updateAcc = await accommodationSchema_1.default.findByIdAndUpdate(req.params.accMoId, req.body, { new: true });
        // console.log(updateAcc);
        res.status(204).send(updateAcc);
    }
    catch (error) {
        // console.log(error);
        next((0, http_errors_1.default)(404, "Wrong accomodations"));
    }
});
accommodationRouter.delete("/:accMoId", token_1.JWTAuthMiddleware, hostMiddleware_1.hostOnlyMiddleware, async (req, res, next) => {
    try {
        const updateAcc = await accommodationSchema_1.default.findByIdAndDelete(req.params.accMoId);
        // console.log(updateAcc);
        res.status(204).send();
    }
    catch (error) {
        // console.log(error);
        next((0, http_errors_1.default)(404, "Wrong accomodations"));
    }
});
exports.default = accommodationRouter;
