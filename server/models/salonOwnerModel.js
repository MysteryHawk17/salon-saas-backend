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
    salonAddress:[
        {
            address:{
                type:String,
            },
            city:{
              type:String
            },
            pincode:{
                type:Number
            }
        }
    ]
})

const salonOwnerModel = mongoose.model("SalonOwner", salonOwnerSchema)
module.exports = salonOwnerModel;
