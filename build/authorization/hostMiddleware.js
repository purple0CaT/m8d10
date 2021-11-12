"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostOnlyMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const hostOnlyMiddleware = (req, res, next) => {
    if (req.user.role === "host") {
        next();
    }
    else {
        next((0, http_errors_1.default)(403, "Only Host"));
    }
};
exports.hostOnlyMiddleware = hostOnlyMiddleware;
