const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

router.post('/save-step', async (req, res) => {
    const { applicationId, stepData, nextStep } = req.body;

    try {
        let app;
        if (applicationId) {
            app = await Application.findByIdAndUpdate(
                applicationId,
                {
                    ...stepData,
                    currentStep: nextStep
                },
                { new: true }
            );
        } else {
            const agentId = req.user ? req.user._id : null;

            app = new Application({
                agentId: agentId,
                source: agentId ? 'agent' : 'web',
                ...stepData,
                currentStep: nextStep || 'COMPLETED'
            });
            await app.save();
        }
        res.json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/all', protect, async (req, res) => {
    try {
        const userRole = req.user.role ? req.user.role.toLowerCase() : '';
        const filter = userRole === 'admin' ? {} : { agentId: req.user._id };

        const apps = await Application.find(filter)
            .populate({
                path: 'lines.package',
                select: 'name price'
            })
            .sort({ createdAt: -1 });

        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;