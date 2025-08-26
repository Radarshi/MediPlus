import mongoose from 'mongoose';
import { initUserConnection } from '../db/connections.js';
import Counter from './counter.js';

const userConnection  = await initUserConnection();

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
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

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "userId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // Format: USR0001, USR0002...
      this.userId = "USR" + counter.seq.toString().padStart(4, "0");
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const userSchema = userConnection.model('userSchema', UserSchema);

export { userSchema };

