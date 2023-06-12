const mongoose = require("mongoose");

const membershipSchema = mongoose.Schema({
    membershipName: {
        type: String,
        unique: true,
        required: true
    },
    membershipPrice: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    rewardPointsOnPurchase: {
        type: Number,
        required: true
    },
    discountOnService: {
        type: Number,
        required: true
    },
    discountOnProducts: {
        type: Number,
        required: true
    },
    minBilledAmount: {
        type: Number,
        required: true
    },
    discountOnPackage: {
        type: Number,
        required: true
    },
    rewardPointsBoost: {
        type: Number,
        required: true
    },
    minRewardPointsEarn: {
        type: Number,
        required: true
    }
},{timestamps:true})

const membershipModel = mongoose.model("Membership", membershipSchema);

module.exports = membershipModel;