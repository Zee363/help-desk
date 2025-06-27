const User = require('../models/user');

const getCurrentUser = async (req, res) =>{
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getting current user', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getCurrentUser };