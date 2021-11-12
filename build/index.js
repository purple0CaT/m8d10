"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
process.env.TS_NODE_DEV && require("dotenv").config();
const port = process.env.PORT || 3003;
mongoose_1.default.connect(process.env.MONGO_URL);
mongoose_1.default.connection.on("connected", () => {
    console.log("Successfully connected to mongoDB 🚀");
    app_1.server.listen(port, () => {
        console.table((0, express_list_endpoints_1.default)(app_1.server));
        console.log("Server 🚀 > ", port);
    });
});
mongoose_1.default.connection.on("error", (err) => {
    console.log("Mongo ERROR", err);
});
app_1.server.on("error", (err) => {
    console.error("Server crashed due to ", err);
});
