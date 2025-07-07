require('dotenv').config();
const jwt = require('jsonwebtoken');

// Verfy token and attach user to request
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access token missing.' });
    }

   
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            const message = err.name === 'TokenExpiredError' ? 'Access token expired.' : 'Invalid access token.';
            return res.status(403).json({ message });
        }
        console.log("Decoded user:", user)
        req.user = user; // attaches decoded token { id, email, role }
        next();
    });
};


// Middleware to allow only admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
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