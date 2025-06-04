const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a JWT token for the user
const createToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
          fullname,
          email,
          password: hashedPassword
      });

      await newUser.save();
      
      const token = createToken(newUser);
      console.log('Generated Token:', token);

    res.status(201).json({
        message: 'User registered successfully',
        token: token,
        user: { id: newUser._id, fullname: newUser.fullname, email: newUser.email}
    });
} catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
       