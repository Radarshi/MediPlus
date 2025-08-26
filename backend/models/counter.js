import mongoose from "mongoose";
import { initUserConnection } from "../db/connections.js";

const  userConnection  = await initUserConnection();

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = userConnection.model("Counter", counterSchema);

export default Counter;