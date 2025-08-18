import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './db/authdb.js';
import authform from './routes/authform.js';



connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authform); 

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});