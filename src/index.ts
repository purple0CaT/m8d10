import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import { server } from "./app";
process.env.TS_NODE_DEV && require("dotenv").config();
const port = process.env.PORT || 3003;

mongoose.connect(process.env.MONGO_URL!);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to mongoDB 🚀");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server 🚀 > ", port);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("Mongo ERROR", err);
});

server.on("error", (err) => {
  console.error("Server crashed due to ", err);
});
