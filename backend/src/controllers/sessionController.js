const Session = require('../models/Session');

// @desc    Get active sessions
// @route   GET /sessions
// @access  Private
const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.sub }).sort({ lastActive: -1 });

        // Map to a friendlier format
        const sessionsList = sessions.map(session => ({
            id: session._id,
            sid: session.sid, // internal session id if needed
            ip: session.ipAddress,
            device: session.deviceInfo?.device || 'Unknown Device',
            browser: session.deviceInfo?.browser || 'Unknown Browser',
            os: session.deviceInfo?.os || 'Unknown OS',
            lastActive: session.lastActive,
            isCurrent: session.sid === req.user.sid // Mark if this is the current session
        }));

        res.json(sessionsList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Revoke a session
// @route   DELETE /sessions/:id
// @access  Private
const revokeSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Ensure session belongs to user
        if (session.user.toString() !== req.user.sub) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Session.deleteOne({ _id: session._id });

        res.json({ message: 'Session revoked' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getSessions,
    revokeSession
};
