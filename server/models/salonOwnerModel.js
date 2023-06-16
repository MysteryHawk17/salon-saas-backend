const mongoose = require("mongoose");

const salonOwnerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    kyc: [
        {
            documentName: {
                type: String,
            },
            documentImg: {
                type: String,

            }

        }
    ],
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription"
    },
    address:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    }]
},{timestamps:true})

const salonOwnerModel = mongoose.model("SalonOwner", salonOwnerSchema)
module.exports = salonOwnerModel;
