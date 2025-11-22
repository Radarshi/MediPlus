import dotenv from "dotenv";  
import mongoose from "mongoose";  // MongoDB ODM (Object Data Modeling) library
dotenv.config(); 

// Global variables: Store connection instances
let userConnection;       
let consultConnection;    
let labTestConnection;   
let blogConnection;      
let orderConnection;      

// Function: Initialize connection to User database
export const initUserConnection = async () => {
  // Check if connection already exists (prevents duplicate connections)
  if (!userConnection) {
    // Get database URI from environment variables
    const uri = process.env.MONGODB_URI;
    
    // Safety check: Ensure URI exists
    if (!uri) throw new Error("MONGODB_URI missing");
    
    // Create new MongoDB connection
    userConnection = await mongoose.createConnection(uri, {
      useNewUrlParser: true,      // Use new URL parser (deprecated but safe)
      useUnifiedTopology: true,   // Use new connection management engine
    });
    
    // Event listener: Log when connection is successful
    userConnection.on("connected", () => console.log("✅ User DB connected"));
  }
  
  // Return the connection instance
  return userConnection;
};


// Function: Initialize connection to Consult database
export const initConsultConnection = async () => {
  if (!consultConnection) {
    // Note: Uses MONGO_URI (different from MONGODB_URI)
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


// Function: Initialize connection to Lab Test database
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


// Function: Initialize connection to Blog database
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


// Function: Initialize connection to Order database
export const initOrderConnection = async () => {
  if (!orderConnection) {
    // Uses MONGO_ORDER_URI if exists, otherwise falls back to MONGO_URI
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