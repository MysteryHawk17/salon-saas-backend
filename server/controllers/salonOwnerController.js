const ownerDB = require("../models/salonOwnerModel")
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddlewares");

const bcrypt = require("bcryptjs")
const jwt = require('../utils/jwt')
const cloudinary = require("../utils/cloudinary")

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'salon owner routes established')
})

const createOwner = asynchandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
        response.validationError(res, 'Please enter valid details in all fields')
        return;
    }
    const findOwner = await ownerDB.findOne({ email: email });
    if (findOwner) {
        response.errorResponse(res, "Owner account  already exists.Please login", 400);
        return;
    }
    else {

        const salt = await bcrypt.genSalt(10);
        console.log(password)
        const hashPassword = await bcrypt.hash(password, salt);
        console.log(hashPassword);

        const newOwner = new superAdminDb({
            name: name,
            email: email,
            password: hashPassword,
            phone
        })
        const savedOwner = await newOwner.save();

        const token = jwt(savedOwner._id);
        const { password, createdAt, updatedAt, ...other } = savedOwner._doc;


        const data = {
            other,
            token: token
        }
        if (savedUser) {
            response.successResponse(res, data, "Owner created Successfully")
        }
        else {
            response.errorResponse(res, 'Error in creating Owner', 400);
        }

    }

})
const loginOwner = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        response.validationError(res, "Please fill in the details properly")
    }
    else {
        const owner = await ownerDB.findOne({ email: email });
        if (owner) {
            const comparePassword = await bcrypt.compare(password, owner.password);
            if (comparePassword) {
                const token = jwt(owner._id);
                const { password, createdAt, updatedAt, ...other } = owner._doc;
                const data = {
                    other,
                    token: token
                }
                response.successResponse(res, data, "Login successful");

            }
            else {
                response.validationError(res, "Password incorrect");
            }

        }
        else {
            response.notFoundError(res, "Owner not found");
        }

    }
})

const updateKyc = asynchandler(async (req, res) => {
    const id = req.params.id;

    const { documentName } = req.body;
    if (!documentName || !req.file || !id) {
        response.validationError(res, "Invalid input datas or parameter");
        return;
    }
    const findOwner = await ownerDB.findById({ _id: id });
    if (findOwner) {
        const uploadedData = await cloudinary.uploader.upload(req.file.path, {
            folder: "Salon"
        })
        const index = findOwner.kyc.findIndex((e) => {
            e.documentName == documentName
        })
        findOwner.kyc.splice(index, 1);
        const removedDuplicate = await findOwner.save();
        if (removedDuplicate) {
            const newData = {
                documentName: documentName,
                documentImg: uploadedData.secure_url
            }
            const updatedOwner = await ownerDB.findByIdAndUpdate({ _id: id }, {
                $push: { kyc: newData }
            }, { new: true });
            if (updatedOwner) {
                response.successResponse(res, '', 'Updated kyc successfully');
            } else {
                response.internalServerError(res, "Failed to update the kyc");

            }
        }
        else {
            response.internalServerError(res, "Failed to update the kyc")
        }
    }
    else {
        response.notFoundError(res, "Cannot find the salon owner");
    }


})


module.exports={test,createOwner,loginOwner,updateKyc};