import mongoose from "mongoose";
import { initLabTestConnection } from "../db/connections.js";

const labTestConnection  = await initLabTestConnection();

const LabBookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    instruction: {
        type: String
    }
},
{timestamps:true})

const labTestSchema = labTestConnection.model("Lab Booking",LabBookingSchema);

export default labTestSchema ;
