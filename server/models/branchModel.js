const mongoose=require("mongoose");

const branchSchema=mongoose.Schema({
    branchName:{
        type:String,
        required:true
    },
    branchManagerName:{
        type:String,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    poc:{
        type:String,
        required:true
    },

},{timestamps:true});


const branchModel=mongoose.model("Branch",branchSchema);
module.exports=branchModel;