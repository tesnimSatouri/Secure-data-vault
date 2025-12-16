const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // We can store a hash of the token's unique identifier (jti) or the whole token signature
    // to identify which session corresponds to which JWT.
    // Ideally, the JWT payload contains a `sid` (Session ID).
    sid: {
        type: String,
        required: true,
        unique: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    deviceInfo: {
        browser: String,
        os: String,
        device: String
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index: documents expire automatically when this date is reached
    }
});

module.exports = mongoose.model('Session', SessionSchema);
