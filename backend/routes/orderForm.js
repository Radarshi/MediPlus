import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateToken from '../generatetoken.js';
import User from '../models/user.js';

const router = express.Router();

// Password validation function
const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
};

// POST /api/signup
router.post('/api/signup', async (req, res) => {
  try {
    const { name, age, gender, email, phone, password } = req.body;

    if (!name || !age || !gender || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Password must include uppercase, lowercase, number, special character and be 8+ chars long'
      });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, age, gender, email, phone, password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        userId: user.userId, 
        name: user.name, 
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        picture: user.picture || null
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// POST /auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({
      token,
      user: { 
        id: user._id, 
        userId: user.userId, 
        name: user.name, 
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        picture: user.picture || null
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// -------------------- GOOGLE AUTH -------------------------

// STEP 1: Redirect user to Google login page
router.get('/auth/google', (req, res) => {
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=profile email`;

  res.redirect(googleAuthUrl);
});

// STEP 2: Google redirects back to our backend - FIXED VERSION
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) return res.redirect('http://localhost:8080/login?error=no_code');

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token)
      return res.redirect('http://localhost:8080/login?error=token_failed');

    // Fetch user profile
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const googleUser = await userResponse.json();

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.id,
        picture: googleUser.picture,
        age: 0,
        gender: "other",
        phone: "",
        password: await bcrypt.hash(Math.random().toString(36), 10)
      });
    } else {
      // Update picture if it's a Google user
      if (!user.picture && googleUser.picture) {
        user.picture = googleUser.picture;
        await user.save();
      }
    }

    const token = generateToken(user._id);
    
    // FIXED: Properly encode user data as JSON string
    const userDataEncoded = encodeURIComponent(JSON.stringify({
      id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
      picture: user.picture
    }));

    // Redirect frontend with token and user data
    return res.redirect(`http://localhost:8080/auth/success?token=${token}&user=${userDataEncoded}`);

  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.redirect('http://localhost:8080/login?error=oauth_failed');
  }
});

// -------------------- UPDATE PROFILE -------------------------

// PUT /api/update-profile - Update user profile
router.put('/api/update-profile', async (req, res) => {
  try {
    console.log('Update profile request received:', req.body);
    
    // Get token from Authorization header
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;

    console.log('Token received:', token ? 'Yes' : 'No');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully, userId:', decoded.id);
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Extract fields from request body
    const { name, phone, age, gender } = req.body;
    console.log('Update data:', { name, phone, age, gender });

    // Validate phone if provided
    if (phone && phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Phone must be exactly 10 digits' });
    }

    // Validate age if provided
    if (age !== undefined && age !== null && age !== '') {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        return res.status(400).json({ error: 'Age must be between 1 and 120' });
      }
    }

    // Validate gender
    if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({ error: 'Gender must be male, female, or other' });
    }

    // Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('User not found for id:', decoded.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user.email);

    // Update fields (only if provided)
    if (name && name.trim()) {
      user.name = name.trim();
    }
    
    if (phone !== undefined) {
      user.phone = phone.trim();
    }
    
    if (age !== undefined && age !== null && age !== '') {
      user.age = parseInt(age) || 0;
    }
    
    if (gender) {
      user.gender = gender.toLowerCase();
    }

    // Save updated user
    await user.save();
    console.log('User updated successfully');

    // Return updated user object
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        picture: user.picture || null
      }
    });

  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error during profile update', details: err.message });
  }
});

export default router;