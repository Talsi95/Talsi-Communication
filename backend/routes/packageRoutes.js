const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { protect } = require('../middleware/auth');

router.get('/public', async (req, res) => {
    try {
        const publicPackages = await Package.find({ isPrivate: false });
        res.json(publicPackages);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בשליפת חבילות ציבוריות" });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const packages = await Package.find({
            $or: [
                { isPrivate: false },
                { isPrivate: true }
            ]
        });
        res.json(packages);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;