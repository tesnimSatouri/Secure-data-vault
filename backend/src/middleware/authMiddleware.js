const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const Session = require('../models/Session');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            // Check if session still exists
            const session = await Session.findOne({ sid: decoded.sid });
            if (!session) {
                return res.status(401).json({ message: 'Session expired or revoked' });
            }

            req.user = { ...decoded, _id: decoded.sub }; // Ensure _id is available
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
