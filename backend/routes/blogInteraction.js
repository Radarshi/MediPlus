// routes/blogRoutes.js
import express from "express";
import Blog from "../models/blogs.js";

const router = express.Router();

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({createdAt:-1});
    //Remove this after Understanding
    console.log(blogs);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new blog
router.post("/", async (req, res) => {
  try {
    const { featured,author,title,content,category,tags } = req.body;
    console.log(req.body);

    if (!author || !title || !content || !category) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newBlog = new Blog({
      featured,
      author,
      title,
      excerpt:content.slice(0,120) + '...',
      content,
      tags,
      date: new Date().toLocaleDateString(),
      category,
      createdAt
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
