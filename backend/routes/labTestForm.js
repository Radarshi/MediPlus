import express from 'express';
import generateToken from '../generatetoken.js';
import  labTestSchema  from '../models/lab-test.js';
import { userSchema as User } from '../models/user.js';

const router = express.Router();

router.post('/api/lab-booking', async (req, res) => {
  try {
    const Lab_Test = req.db.model("Lab_Test", labTestSchema);

    const { name, phone, email, address, date, time,instruction } = req.body;

      const user = await User.findOne({ name,email });
      if (!name || !email || !user)
        return res.status(400).json({ error: 'User not found' });
    
    const lab_test = await Lab_Test.create({
      userId: user.userId,
      name,
      phone,
      email,
      address,
      date,
      time,
      instruction
    });
      console.log(lab_test);
      
    const token = generateToken(lab_test._id);

    res.status(201).json({ message: "Lab Test session booked" ,lab_test,token});
  } catch (err) {
     console.error("Lab Test booking failed:", err)
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;