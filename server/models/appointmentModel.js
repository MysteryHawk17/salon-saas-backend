const mongoose = require("mongoose");


const appointmentSchema = mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    clientNumber: {
        type: Number,
        required: true
    },
    timeOfAppointment: {
        type: String,
        required: true
    },
    sourceOfAppointment: {
        type: String,
        required: true
    },
    dateOfAppointment: {
        type: String,
    },
    discount: {
        type: Number
    },
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
    },
    serviceFor: {
        type: String,

    },
    serviceSelected: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    durationOfAppointment: {
        type: Object,
    },
    appointmentStatus: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paidDues: {
        type: Number,
        required: true
    },
    advancedGiven: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    giveRewardPoints: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

module.exports = appointmentModel