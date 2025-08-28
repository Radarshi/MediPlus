import express from 'express';
import generateToken from '../generatetoken.js';
import User from '../models/user.js';

const router = express.Router();

router.post('/api/signup', async (req, res) => {
  try {
    const { name, age, gender, email, phone, password } = req.body;
    console.log(req.body);
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    

    const user = await User.create({ name, age, gender, email, phone, password });
    const token = generateToken(user._id);

    res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;