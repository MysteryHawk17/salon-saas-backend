const ownerDB = require("../models/salonOwnerModel")
const subscriptionDB = require("../models/subscriptionModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddlewares");

const bcrypt = require("bcryptjs")
const jwt = require('../utils/jwt')
const cloudinary = require("../utils/cloudinary")

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'salon owner routes established')
})

const createOwner = asynchandler(async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password || !address) {
        response.validationError(res, 'Please enter valid details in all fields')
        return;
    }
    const findOwner = await ownerDB.findOne({ email: email });
    if (findOwner) {
        response.errorResponse(res, "Owner account  already exists.Please login", 400);
        return;
    }
    else {

        // const salt = await bcrypt.genSalt(10);
        // console.log(password)
        // const hashPassword = await bcrypt.hash(password, salt);
        // console.log(hashPassword);

        const newOwner = new ownerDB({
            name: name,
            email: email,
            password: password,
            phone,
            salonAddress: address
        })
        const savedOwner = await newOwner.save();

        const token = jwt(savedOwner._id);
        const { createdAt, updatedAt, ...other } = savedOwner._doc;


        const data = {
            other,
            token: token
        }
        if (savedOwner) {
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
            // const comparePassword = await bcrypt.compare(password, owner.password);
            if (owner.password==password) {
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

const updateDetails = asynchandler(async (req, res) => {
    const { name, phone, address } = req.body;
    const { id } = req.params;
    if (!id) {
        return response.validationError(res, 'Invalid parameters');
    }
    const findOwner = await ownerDB.findById({ _id: id });
    if (findOwner) {
        const updateData = {};
        if (name) {
            updateData.name = name;
        }
        if (phone) {
            updateData.phone = phone;
        }
        if (address) {
            updateData.salonAddress = address;
        }
        const updatedProfile = await ownerDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedProfile) {
            response.successResponse(res, updatedProfile, 'Successfully updated the profile');
        }
        else {
            response.internalServerError(res, 'Failed to update the profile');
        }
    }
    else {
        response.notFoundError(res, "Cannot find the owner");
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
        const index = findOwner.kyc.findIndex(e=>e.documentName===documentName)
        
        console.log(index)
        if (index != -1) {
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
                    response.successResponse(res, updatedOwner, 'Updated kyc successfully');
                } else {
                    response.internalServerError(res, "Failed to update the kyc");

                }
            }
            else {
                response.internalServerError(res, "Failed to update the kyc")
            }
        }
        else {

            const newData = {
                documentName: documentName,
                documentImg: uploadedData.secure_url
            }
            const updatedOwner = await ownerDB.findByIdAndUpdate({ _id: id }, {
                $push: { kyc: newData }
            }, { new: true });
            if (updatedOwner) {
                response.successResponse(res, updatedOwner, 'Updated kyc successfully');
            } else {
                response.internalServerError(res, "Failed to update the kyc");

            }
        }

    }

    else {
        response.notFoundError(res, "Cannot find the salon owner");
    }


})

const getProfile = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "invalid parametes");
        return;
    }
    const findUser = await ownerDB.findById({ _id: id }).populate("subscriptionId");
    if (findUser) {
        response.successResponse(res, findUser, 'Fetched the profile successfully');
    }
    else {
        response.notFoundError(res, 'Cannot fetch the profile');
    }
})

const cancelSubscription = asynchandler(async (req, res) => {
    const { ownerId } = req.params;
    const { subscriptionId } = req.body;
    if (!subscriptionId) {
        return response.validationError(res, 'Subscription id is required for getting the subscription ');
    }
    const findSubscription = await subscriptionDB.findById($and[{ _id: subscriptionId }, { salonOwnerId: ownerId }]);
    if (findSubscription.length == 0) {
        response.notFoundError(res, 'No subscription under your name');
    }
    else {
        const updateSubscriptionStatus = await subscriptionDB.findByIdAndUpdate({ _id: subscriptionId }, {
            status: "CANCELLED"
        }, { new: true });
        if (updateSubscriptionStatus) {
            response.successResponse(res, updateSubscriptionStatus, "Successfully cancelled the subscription");
        }
        else {
            response.internalServerError(res, 'Failed to cancel the subscription ');
        }
    }
})
module.exports = { test, createOwner, loginOwner, updateKyc, cancelSubscription, getProfile, updateDetails };