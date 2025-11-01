import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

let userConnection;
let consultConnection;
let labTestConnection;
let blogConnection;
let orderConnection;

// Initialize User DB
export const initUserConnection = async () => {
  if (!userConnection) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI missing");
    userConnection = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    userConnection.on("connected", () => console.log("✅ User DB connected"));
  }
  return userConnection;
};

// Initialize Consult DB
export const initConsultConnection = async () => {
  if (!consultConnection) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI missing");
    consultConnection = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    consultConnection.on("connected", () => console.log("✅ Consult DB connected"));
  }
  return consultConnection;
};

// Initialize LabTest DB
export const initLabTestConnection = async () => {
  if (!labTestConnection) {
    const uri = process.env.MONGO_LAB_TEST_URI;
    if (!uri) throw new Error("MONGO_LAB_TEST_URI missing");
    labTestConnection = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    labTestConnection.on("connected", () => console.log("✅ Lab Test DB connected"));
  }
  return labTestConnection;
};

// Initialize Blog DB
export const initBlogConnection = async () => {
  if (!blogConnection) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI missing");
    blogConnection = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    blogConnection.on("connected", () => console.log("✅ Blog DB connected"));
  }
  return blogConnection;
};

// Initialize Order DB
export const initOrderConnection = async () => {
  if (!orderConnection) {
    const uri = process.env.MONGO_ORDER_URI || process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_ORDER_URI missing");
    orderConnection = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    orderConnection.on("connected", () => console.log("✅ Order DB connected"));
  }
  return orderConnection;
};