"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const index_1 = __importDefault(require("./accommodation/index"));
const facebook_js_1 = __importDefault(require("./authorization/facebook.js"));
const google_js_1 = __importDefault(require("./authorization/google.js"));
const login_js_1 = __importDefault(require("./authorization/login.js"));
const register_js_1 = __importDefault(require("./authorization/register.js"));
const errorHadlers_js_1 = require("./errorHadlers.js");
const user_js_1 = __importDefault(require("./user/user.js"));
exports.server = (0, express_1.default)();
//***********MIDDLEWARES ********************** */
passport_1.default.use("facebook", facebook_js_1.default);
passport_1.default.use("google", google_js_1.default);
exports.server.use((0, cors_1.default)());
exports.server.use(express_1.default.json());
exports.server.use((0, cookie_parser_1.default)());
exports.server.use(passport_1.default.initialize());
//************Router ****************
// server.use("/auth", authorizRoute);
exports.server.use("/user", user_js_1.default);
exports.server.use("/login", login_js_1.default);
exports.server.use("/register", register_js_1.default);
exports.server.use("/accommodation", index_1.default);
exports.server.use(errorHadlers_js_1.unauthorizedHandler);
exports.server.use(errorHadlers_js_1.forbiddenHandler);
exports.server.use(errorHadlers_js_1.catchAllHandler);
//
