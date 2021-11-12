"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { model, Schema } = mongoose_1.default;
const accommodationSchema = new Schema({
    name: {
        type: String,
        required: [true, "Accommodation name is required"],
    },
    host: [{ type: Schema.Types.ObjectId, ref: "User" }],
    description: {
        type: String,
        required: [true, "A description is required"],
    },
    maxGuests: {
        type: Number,
        required: [true, "Number of quest is required"],
        min: 1,
        max: 5,
        default: 1,
    },
    city: {
        type: String,
        required: [true, "City name is required"],
    },
});
exports.default = model("accommodation", accommodationSchema);
