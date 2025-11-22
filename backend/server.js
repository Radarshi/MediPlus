import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { initBlogConnection, initConsultConnection, initLabTestConnection, initOrderConnection, initUserConnection } from './db/connections.js';
import authform from './routes/authform.js';
import meRoute from './routes/me.js';
import blogForm from './routes/blogInteraction.js';
import consultForm from './routes/consultationForm.js';
import labTestForm from './routes/labTestForm.js';
import orderForm from './routes/orderForm.js';
dotenv.config();

const startServer = async() => {
  const userConnection = await initUserConnection();
  const consultConnection = await initConsultConnection();
  const labTestConnection = await initLabTestConnection();
  const blogConnection = await initBlogConnection();
  const orderConnection = await initOrderConnection();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Auth routes (login, signup, Google OAuth)
  app.use("/", (req, res, next) => {
    req.db = userConnection;
    next();
  }, authform);

  // User profile route (/api/me) - FIXED: Added this route
  app.use("/", (req, res, next) => {
    req.db = userConnection;
    next();
  }, meRoute);

  // Consultation routes
  app.use("/", (req, res, next) => {
    req.db = consultConnection;
    next();
  }, consultForm);

  // Lab test routes
  app.use("/api/lab-booking", (req,res,next) => {
    req.db = labTestConnection;
    next();
  },labTestForm);

  // Blog routes
  app.use("/api/blogs",(req,res,next) => {
    req.db = blogConnection;
    next();
  },blogForm);

  // Order routes
  app.use("/api/orders",(req,res,next) => {
    req.db = orderConnection;
    next();
  },orderForm);

  app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
  });
}

startServer();