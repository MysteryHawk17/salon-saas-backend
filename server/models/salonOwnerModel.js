const mongoose=require("mongoose");

const salonOwnerSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    kyc:[
        {
            documentName:{
                type:String,
            },
            documentImg:{
                type:String,

            }

        }
    ]
})

const salonOwnerModel=mongoose.model("SalonOwner",salonOwnerSchema)
module.exports=salonOwnerModel;
