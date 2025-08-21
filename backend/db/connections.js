import dotenv from "dotenv";
import mongoose from 'mongoose';
dotenv.config();

const connectDB = async() => {
  const userUri = process.env.MONGODB_URI;
  const consultUri = process.env.MONGO_URI;

  if (!userUri) throw new Error("MONGODB_URI is missing in .env");
  if (!consultUri) throw new Error("MONGO_URI is missing in .env");

  const userConnection = await mongoose.createConnection(userUri);

  const consultConnection = await mongoose.createConnection(consultUri);

  userConnection.on("connected", () => console.log("✅ User DB connected"));
  consultConnection.on("connected", () => console.log("✅ Consult DB connected"));

  return { userConnection, consultConnection };
};

export default connectDB;