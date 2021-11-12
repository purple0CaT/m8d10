"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuthMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const schema_1 = __importDefault(require("../user/schema"));
const tokenAuth_js_1 = require("./tokenAuth.js");
const JWTAuthMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        next((0, http_errors_1.default)(401, "Please Provide credentials"));
    }
    else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "");
            const decodeToken = await (0, tokenAuth_js_1.verifyJWT)(token);
            const findUserById = await schema_1.default.findById(decodeToken._id);
            if (findUserById) {
                req.user = findUserById;
                next();
            }
            else {
                next((0, http_errors_1.default)(401, "User not found!"));
            }
        }
        catch (error) {
            next((0, http_errors_1.default)(401, "Token not valid!"));
        }
    }
};
exports.JWTAuthMiddleware = JWTAuthMiddleware;
