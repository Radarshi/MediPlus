import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connectDB from './db/connections.js';
import authform from './routes/authform.js';
import consultForm from './routes/consultationForm.js';
dotenv.config();


const startServer = async() => {
const { userConnection, consultConnection } = await connectDB;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/", (req, res, next) => {
  req.db = userConnection;
  next();
}, authform);

app.use("/", (req, res, next) => {
  req.db = consultConnection;
  next();
}, consultForm);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
}
startServer()