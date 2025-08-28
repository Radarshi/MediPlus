import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import validator from 'validator'
import generateToken from '../generatetoken.js';
import { getConsultModel } from '../models/consult.js';
import User from '../models/user.js';
dotenv.config();

const router = express.Router();

router.post('/api/consulting', async (req, res) => {
  try {
    const { name, age, phone, email, symptoms, preferred_date, preferred_time, doctor_name, doctor_id} = req.body;

    if (!validator.isEmail(email))
        return res.status(400).json({ error: "Invalid email address" });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ error: 'User not found' });

    const Consult = await getConsultModel();
    const consult = await Consult.create({
      userId: user.userId,
      name,
      doctor_name,
      doctor_id,
      age,
      phone,
      email,
      symptoms,
      preferred_date,
      preferred_time });
      console.log(consult);
      
    const token = generateToken(consult._id);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"MediPlus" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Consultation Booking Confirmation",
      text: `Hello ${name},\n\nYour Consultation has been successfully booked.\n\n📅 Date: ${preferred_date}\n⏰ Time: ${preferred_time}\n\nThank you for choosing MediPlus!`,
      html: `
        <h2>Consultation Booking Confirmation</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Your Consultation has been successfully booked with ${doctor_name}.</p>
        <p><b>Date:</b> ${preferred_date}<br/>
        <b>Time:</b> ${preferred_time}</p>
        <p>Thank you for choosing <b>MediPlus</b>!</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Booking successful, confirmation email sent!" });
  } catch (err) {
    console.error("Consultation booking failed:", err)
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;