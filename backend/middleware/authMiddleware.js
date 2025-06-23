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

   
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            const message = err.name === 'TokenExpiredError' ? 'Access token expired.' : 'Invalid access token.';
            return res.status(403).json({ message });
        }
        req.user = user;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const requestedId = req.params.id || req.body.id;
    if (requestedId && req.user._id.toString() !== requestedId.toString()) {
        return res.status(403).json({ message: 'Access denied. You can only access your own data.' });
    }

    next();
}

    // Middleware to filter results based on user role
    const filterByUserRole = (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (req.user.role !== 'admin') {
           req.user.filter = { createdBy: req.user._id };
        }

        next();
    };

module.exports = {authenticateToken, requireAdmin, filterByUserRole};