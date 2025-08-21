import mongoose from "mongoose";
import connectDB from "../db/connections.js";

const { consultConnection } = await connectDB();

const consultSchema = new mongoose.Schema({
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

const Consult = consultConnection.model("Consult", consultSchema);

export default Consult;
