const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    idNumber: { type: String, required: true },

    lines: [{
        package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
        phoneNumber: String,
        type: { type: String, enum: ['new', 'porting'] },
    }],

    totalAmount: { type: Number, default: 0 },

    source: { type: String, enum: ['web', 'agent'], default: 'web' },

    status: { type: String, enum: ['Draft', 'Submitted', 'Completed'], default: 'Draft' },
    currentStep: { type: String, default: 'INIT' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);