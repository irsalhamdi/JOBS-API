const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide positin'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'decline', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'internship'],
        default: 'full-time'
    },
    jobLocation: {
        type: String,
        default: 'my-city',
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('Job', schema);
module.exports = User;