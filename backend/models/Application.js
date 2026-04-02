const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    type: { type: String, enum: ['New', 'Porting'] },
    phoneNumber: String,
    selectedPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    customerInfo: {
        fullName: String,
        address: String,
        email: String,
        idNumber: String
    },
    billingPreference: { type: String, enum: ['Email', 'SMS'] },
    status: { type: String, enum: ['Draft', 'Submitted'], default: 'Draft' },
    currentStep: { type: String, default: 'INIT' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);