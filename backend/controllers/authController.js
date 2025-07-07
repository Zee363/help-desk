const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a JWT token for the user
const createToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { fullname, email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
          fullname,
          email,
          password: hashedPassword,
          role: role || 'user'
      });

      await newUser.save();

      const token = createToken(newUser);
      console.log('Generated Token:', token);

    res.status(201).json({
        message: 'User registered successfully',
        token: token,
        user: { id: newUser._id, fullname: newUser.fullname, email: newUser.email, role: newUser.role }
    });
} catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });
       
        const token = createToken(user);
        console.log('Generated Token:', token);

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};