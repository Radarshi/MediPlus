import express from 'express';
import generateToken from '../generatetoken.js';
import { getConsultModel } from '../models/consult.js';
import { userSchema as User } from '../models/user.js';

const router = express.Router();

router.post('/api/consulting', async (req, res) => {
  try {
    const { name, age, phone, email, symptoms, preferred_date, preferred_time } = req.body;

      const user = await User.findOne({ email });
      console.log("Looking for email:", email);
      console.log("User found:", user);

      if (!user || !email)
        return res.status(400).json({ error: 'User not found' });

    const Consult = await getConsultModel();
    const consult = await Consult.create({
      userId: user.userId,
      name,
      age,
      phone,
      email,
      symptoms,
      preferred_date,
      preferred_time });
      console.log(consult);
      
    const token = generateToken(consult._id);

    res.status(201).json({ message: "Consultation session booked" ,consult,token});
  } catch (err) {
    console.error("Consultation booking failed:", err)
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;