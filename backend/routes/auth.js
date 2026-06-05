const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { email, password, age } = req.body;

    if (!email || !password || age === undefined) {
      return res.status(400).json({ error: 'email, password and age are required' });
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0) {
      return res.status(400).json({ error: 'invalid age' });
    }

    if (ageNum > 120){
      return res.status(400).json({ error: 'age must be under 120' });
    }
  
    if (password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'email already taken' });
    }

    const user = new User({ email, password, age: ageNum });
    await user.save();

    res.status(201).json({ message: 'registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'wrong email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'wrong email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, age: user.age },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        age: user.age
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = router;
