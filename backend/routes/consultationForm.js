import express from 'express';
import generateToken from '../generatetoken.js';
import Consult from '../models/consult.js';

const router = express.Router();

router.post('/api/consulting', async (req, res) => {
  try {
    const { name, age, phone, email, symptoms, preferred_date, preferred_time } = req.body;
      if (!name || !email)
        return res.status(400).json({ error: 'Name and email are required' });
    
    const consult = await Consult.create({ name, age, phone, email, symptoms, preferred_date, preferred_time });
    const token = generateToken(consult._id);

    res.status(201).json({ token });
  } catch (err) {
     console.error("Consultation booking failed:", err)
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;