"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAllHandler = exports.forbiddenHandler = exports.unauthorizedHandler = void 0;
const unauthorizedHandler = (err, req, res, next) => {
    if (err.status === 401) {
        res
            .status(401)
            .send({
            status: "error",
            message: err.message || "You are not logged in!",
        });
    }
    else {
        next(err);
    }
};
exports.unauthorizedHandler = unauthorizedHandler;
const forbiddenHandler = (err, req, res, next) => {
    if (err.status === 403) {
        res
            .status(403)
            .send({
            status: "error",
            message: err.message || "You are not allowed to do that!",
        });
    }
    else {
        next(err);
    }
};
exports.forbiddenHandler = forbiddenHandler;
const catchAllHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ status: "error", message: "Generic Server Error" });
};
exports.catchAllHandler = catchAllHandler;
