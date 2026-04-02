const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

router.post('/save-step', protect, async (req, res) => {
    const { applicationId, stepData, nextStep } = req.body;

    try {
        let app;
        if (applicationId) {
            app = await Application.findByIdAndUpdate(
                applicationId,
                { ...stepData, currentStep: nextStep },
                { new: true }
            );
        } else {
            app = new Application({
                agentId: req.user._id,
                ...stepData,
                currentStep: nextStep
            });
            await app.save();
        }
        res.json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;