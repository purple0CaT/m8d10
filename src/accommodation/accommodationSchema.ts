import mongoose from "mongoose";

const { model, Schema } = mongoose;

const accommodationSchema = new Schema({
  name: {
    type: String,
    required: [true, "Accommodation name is required"],
  },
  host: [{ type: Schema.Types.ObjectId, ref: "User" }],

  description: {
    type: String,
    required: [false, "A description is required"],
  },
  maxGuests: {
    type: Number,
    required: [false, "Number of quest is required"],
    min: 1,
    max: 5,
    default: 1,
  },
  city: {
    type: String,
    required: [true, "City name is required"],
  },
});

export default model("accommodation", accommodationSchema);
