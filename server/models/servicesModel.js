const mongoose = require('mongoose');


const serviceSchema = mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    membershipPrice: {
        type: Number,
        required: true
    },
    rewardPoints: {
        type: Number,
        required: true
    },
    serviceFor: {
        type: String,
        required: true
    }
})

const serviceModel = mongoose.model("Service", serviceSchema);

module.exports = serviceModel;