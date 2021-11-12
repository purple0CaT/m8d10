"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTRefreshAuth = exports.verifyRefreshJWT = exports.verifyJWT = exports.JWTAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_js_1 = __importDefault(require("../user/schema.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWTAuth = async (user) => {
    const accessToken = await generateToken({ _id: user._id });
    const refreshToken = await generateRefreshToken({ _id: user._id });
    return { accessToken, refreshToken };
};
exports.JWTAuth = JWTAuth;
// CREATE TOKENS
const generateToken = async (payload) => new Promise((res, rej) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
    if (err)
        rej(err);
    else
        res(token);
}));
const generateRefreshToken = async (payload) => new Promise((res, rej) => jsonwebtoken_1.default.sign(payload, process.env.JWT_REFR_SECRET, { expiresIn: "1w" }, (err, token) => {
    if (err)
        rej(err);
    else
        res(token);
}));
// TOKEN VERIFICATION
const verifyJWT = async (token) => new Promise((res, rej) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err)
        rej(err);
    else
        res(decodedToken);
}));
exports.verifyJWT = verifyJWT;
// REFRESH TOKEN VERIFICATION
const verifyRefreshJWT = async (token) => new Promise((res, rej) => jsonwebtoken_1.default.verify(token, process.env.JWT_REFR_SECRET, (err, decodedToken) => {
    if (err)
        rej(err);
    else
        res(decodedToken);
}));
exports.verifyRefreshJWT = verifyRefreshJWT;
// create NEW TOKENS USING REFRESH TOKEN
const JWTRefreshAuth = async (refToken) => {
    const decodedToken = await (0, exports.verifyRefreshJWT)(refToken);
    const user = await schema_js_1.default.findById(decodedToken._id);
    if (!user)
        throw (0, http_errors_1.default)(404, "User not found!");
    if (user.refreshToken === refToken) {
        const { accessToken, refreshToken } = await (0, exports.JWTAuth)(user);
        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    }
    else {
        throw (0, http_errors_1.default)(404, "False token");
    }
};
exports.JWTRefreshAuth = JWTRefreshAuth;
