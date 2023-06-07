const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
    salonOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalonOwner"
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING APPROVAL', 'CANCELLED BY ADMIN']
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETE', 'FAILED']
    }
}, { timestamps: true });

const subscriptionModel = mongoose.model("Subscription", subscriptionSchema)

module.exports = subscriptionModel;
