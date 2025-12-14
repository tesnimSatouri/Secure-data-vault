const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.sub).select('-passwordHash -verificationToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            name: user.email.split('@')[0], // Default name from email if not present (logic can be improved if name field added)
            email: user.email,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateMe = async (req, res) => {
    // Currently only supporting name update if we added a name field, 
    // but based on previous User model view, there IS NO name field yet?
    // Let's check the User model again.
    // The previous view showed: email, passwordHash, consent, isVerified, verificationToken.
    // There is NO clear 'name' field in the model shown in step 383/384. 
    // Wait, step 396 Register.jsx sends 'name'. 
    // I should probably add 'name' to the User model first if it's missing, or just handle it if it exists (maybe I missed it).
    // Reviewing User.js content from step 383: 
    // 4: const UserSchema = new mongoose.Schema({
    // 5:   email: { type: String, unique: true, required: true, lowercase: true },
    // 6:   passwordHash: { type: String, required: true },
    // 7:   consent: ...

    // There is NO name field. I should add it.

    try {
        const user = await User.findById(req.user.sub);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If I add name field
        if (req.body.name) {
            user.name = req.body.name;
        }

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' });
        }

        const user = await User.findById(req.user.sub);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc    Delete account
// @route   DELETE /api/users/me
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.sub);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.deleteOne({ _id: user._id });
        res.json({ message: 'Account deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getMe,
    updateMe,
    changePassword,
    deleteAccount
};
