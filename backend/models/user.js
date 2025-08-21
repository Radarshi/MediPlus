import mongoose from 'mongoose';
import connectDB from '../db/connections.js';

const { userConnection } = await connectDB();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = userConnection.model('User', userSchema);

export default User;