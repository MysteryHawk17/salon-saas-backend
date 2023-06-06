const mongoose=require("mongoose");

const superAdminSchema=mongoose.Schema({
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
    }
},{timestamps:true});

const superAdminModel=mongoose.model("Superadmin",superAdminSchema);

module.exports=superAdminModel;
