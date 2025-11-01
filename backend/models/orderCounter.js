import mongoose from "mongoose";
import { initOrderConnection } from "../db/connections.js";

const orderConnection = await initOrderConnection();

const orderCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const OrderCounter = orderConnection.model("OrderCounter", orderCounterSchema);

export default OrderCounter;