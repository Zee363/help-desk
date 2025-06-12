require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Access token missing.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(401).json({ message: 'User not found.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ message: 'Invalid access token.' });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;