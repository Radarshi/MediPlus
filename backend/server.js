import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import blogRoutes from './routes/blogInteraction.js';

dotenv.config()

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/blogs',blogRoutes)

app.listen(port,()=> console.log(`listening on ${port}`))