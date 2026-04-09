const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    dataGB: { type: Number, required: true },
    minutes: { type: Number, required: true },
    sms: { type: Number, required: true },
    isPrivate: { type: Boolean, default: false },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('Package', packageSchema);