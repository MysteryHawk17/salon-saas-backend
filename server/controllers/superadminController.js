const superAdminDb = require("../models/superadminModel");
const subscriptionDB = require("../models/subscriptionModel");
const salonOwnerDB = require("../models/salonOwnerModel")
const response = require("../middlewares/responseMiddlewares.js");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs")
const jwt = require('../utils/jwt')
const sendmail = require("../utils/sendmail");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Superadmin routes established')
})

const createAdmin = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        response.validationError(res, 'Please enter valid details in all fields')
        return;
    }
    const findAdmin = await superAdminDb.findOne({ email: email });
    if (findAdmin) {
        response.errorResponse(res, "Admin account  already exists.Please login", 400);
        return;
    }
    else {

        const salt = await bcrypt.genSalt(10);
        console.log(password)
        const hashPassword = await bcrypt.hash(password, salt);
        console.log(hashPassword);

        const newAdmin = new superAdminDb({
            name: name,
            email: email,
            password: hashPassword,
        })
        const savedAdmin = await newAdmin.save();

        const token = jwt(savedAdmin._id);
        const { createdAt, updatedAt, ...other } = savedAdmin._doc;


        const data = {
            other,
            token: token
        }
        if (savedAdmin) {
            response.successResponse(res, data, "Admin created Successfully")
        }
        else {
            response.errorResponse(res, 'Error in creating Admin', 400);
        }

    }

})
const loginAdmin = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        response.validationError(res, "Please fill in the details properly")
    }
    else {
        const superAdmin = await superAdminDb.findOne({ email: email });
        if (superAdmin) {
            const comparePassword = await bcrypt.compare(password, superAdmin.password);
            if (comparePassword) {
                const token = jwt(superAdmin._id);
                const { password, createdAt, updatedAt, ...other } = superAdmin._doc;
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
            response.notFoundError(res, "Admin not found");
        }

    }
})

const getAllSubscriptions = asynchandler(async (req, res) => {
    const status = req.query.status;

    const queryObj = {};
    if (status) {
        queryObj.status = status;
    }
    const findSubscriptions = await subscriptionDB.find(queryObj).populate("salonOwnerId");
    if (findSubscriptions) {
        response.successResponse(res, findSubscriptions, 'fetched the subscriptions');
    }
    else {
        response.internalServerError(res, 'Cannot fetch the subscriptions');
    }
})

const changeSubscriptionStatus = asynchandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const { status } = req.body;
    if (!subscriptionId || !status) {
        response.validationError(res, 'Parametes not enough for updating the field');
        return;
    }
    const findSubscription = await subscriptionDB.findById({ _id: subscriptionId }).populate("salonOwnerId");
    if (findSubscription) {
        const updatedSubscription = await subscriptionDB.findByIdAndUpdate({ _id: subscriptionId }, {
            status: status
        }, { new: true });
        if (updatedSubscription) {

            const subject = "UPDATES REGARDING YOUR SUBSCRIPTION "
            const send_to = findSubscription.salonOwnerId.email
            const sent_from = process.env.EMAIL_USER
            if (status === 'ACTIVE') {
                const message =
                    `<h2>Hello ${findSubscription.salonOwnerId.name}</h2>
        <p>This is to inform you that your subscription request to our platform has been approved.</p>
        <p>Please use the specified login creadentials to login into the plateform and enjoy its services.</p>
        <p><h2>email:</h2>${findSubscription.salonOwnerId.email}</p>
        <p><h2>password:</h2>${findSubscription.salonOwnerId.password}</p>
        <p>Regards</p>`;
                try {
                    await sendmail(subject, message, send_to, sent_from);
                    response.successResponse(res, '', "Successfully sent the mail");
                } catch {
                    response.internalServerError(res, 'Not able to send the mail');
                }

            }
            else if (status === 'CANCELLED BY ADMIN'){
                const message = `<h2>Hello ${findSubscription.salonOwnerId.name}</h2>
        <p>This is to inform you that your subscription request to our platform has unfortunately been cancelled..</p>
        <p>We are sorry for this unfortunate incident.</p>
        <p>If you still wish to get a subscritiop please write us at </p>
        <p>${process.env.EMAIL}    </p>
        <p>Regards</p>`
                try {
                    await sendmail(subject, message, send_to, sent_from);
                    response.successResponse(res, '', "Successfully sent the mail");
                } catch {
                    response.internalServerError(res, 'Not able to send the mail');
                }
            }
        }
        else {
            response.internalServerError(res, 'Failed to update the subscription ');
        }
    }
    else {
        response.notFoundError(res, "Subscription not found");
    }

})

const getASubscription = asynchandler(async (req, res) => {
    const { subscriptionId } = req.params;
    if (!subscriptionId) {
        response.validationError(res, 'Invalid parameter');
        return;
    }
    const findSubscription = await subscriptionDB.findById({ _id: subscriptionId }).populate("salonOwnerId");
    if (findSubscription) {
        response.successResponse(res, findSubscription, 'Successfully fetched the subscriptions');
    }
    else {
        response.notFoundError(res, 'Cannot find the specified subscription');
    }
})
const getAllOwners = asynchandler(async (req, res) => {

    const findAllOwners = await salonOwnerDB.find({}).populate("subscriptionId").populate("address");
    const finalResult=findAllOwners.filter((e)=>{
        return e.subscriptionId.status!=="PENDING"
    })
    if (findAllOwners) {
        response.successResponse(res, finalResult, "successfully fetched all the owners");
    }
    else {
        response.internalServerError(res, "failed to fetch all the owners");
    }
})
const getASalonOwner = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter');
        return;
    }
    const findSalonOwner = await salonOwnerDB.findById({ _id: id }).populate("subscriptionId").populate("address");
    if (findSalonOwner) {
        response.successResponse(res, findSalonOwner, 'Successfully fetched the subscriptions');
    }
    else {
        response.notFoundError(res, 'Cannot find the specified subscription');
    }
})
module.exports = { test, createAdmin, loginAdmin, getASalonOwner, getASubscription, getAllOwners, getAllSubscriptions, changeSubscriptionStatus };