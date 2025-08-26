import mongoose from "mongoose";
import { initConsultConnection } from "../db/connections.js";


const consultSchema = new mongoose.Schema({
      userId: {
        type: String,
        ref: "User",
        required: true
    },
    name: {
        type : String,
        required : true
    },
    age: {
        type: Number,
        required : true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    symptoms: {
        type: String
    },
    preferred_date: {
        type: Date
    },
    preferred_time: {
        type: String
    },
},{timestamps:true})

export async function getConsultModel() {
  const connection = await initConsultConnection();
  return connection.model("Consult", consultSchema);
}

