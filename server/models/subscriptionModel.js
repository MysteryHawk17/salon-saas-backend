const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salon"
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
        enum: ['ACTIVE', 'EXPIRED', 'CANCELLED']
    }
}, { timestamps: true });

const subscriptionModel=mongoose.model("Subscription",subscriptionSchema)

module.exports=subscriptionModel;
