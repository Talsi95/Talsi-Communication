const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "פרטי התחברות שגויים" });
        }

        if (user.status === 'Blocked') {
            return res.status(403).json({ message: "גישתך למערכת נחסמה. פנה למנהל." });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "פרטי התחברות שגויים" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: "שגיאת שרת" });
    }
});

module.exports = router;