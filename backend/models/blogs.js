import mongoose from "mongoose";

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

const Counter = mongoose.model('Counter', counterSchema);

blogSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'blogId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
  next();
});


const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
