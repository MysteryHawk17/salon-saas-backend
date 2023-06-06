const mongoose = require("mongoose");

const salonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },
    location:

    {
        address: {
            type: String,
        },
        pincode: {
            type: Number
        }

    },
    salonOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalonOwner"
    }

})

const salonModel = mongoose.model("Salon", salonSchema);
module.exports = salonModel;