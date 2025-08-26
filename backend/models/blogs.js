import mongoose from "mongoose";
import { initUserConnection } from "../db/connections.js";

const blogSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  featured:{
    type: Boolean,
    default: false
  },
  author:{
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt:{
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  date:{
    type: String
  },
  category: {
    type: String,
    default: 'Others'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},
{timeStamps:true});

const counterSchema = new mongoose.Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 }
});

export async function getBlogModel() {
  const connection = await initUserConnection();

  // Use connection-bound Counter
  const Counter = connection.model("Counter", counterSchema);

  // Pre-save hook with connection-bound Counter
  blogSchema.pre("save", async function (next) {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "blogId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
    }
    next();
  });

  return connection.model("Blog", blogSchema);
}
