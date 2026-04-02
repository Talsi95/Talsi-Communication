const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Package = require('../models/Package');
const { protect } = require('../middleware/auth');

// Middleware פנימי שבודק אם המשתמש הוא אדמין
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: "גישת מנהל בלבד" });
    }
};

// 1. קבלת כל הסוכנים
router.get('/agents', protect, adminOnly, async (req, res) => {
    const agents = await User.find({ role: 'Agent' }).select('-password');
    res.json(agents);
});

// 2. עדכון סטטוס סוכן (חסימה/שחרור)
router.patch('/agents/:id/status', protect, adminOnly, async (req, res) => {
    const { status } = req.body; // 'Active' or 'Blocked'
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בעדכון סטטוס" });
    }
});

// 3. יצירת חבילה חדשה (כולל שיוך לסוכן)
router.post('/packages', protect, adminOnly, async (req, res) => {
    try {
        const newPackage = new Package(req.body);
        await newPackage.save();
        res.json(newPackage);
    } catch (err) {
        res.status(500).json({ message: "שגיאה ביצירת חבילה" });
    }
});

module.exports = router;