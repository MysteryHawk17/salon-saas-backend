const subscriptionDB = require("../models/subscriptionModel");
const slaonOwnerDB = require("../models/salonOwnerModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddlewares");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Subscription routes established');
})

const createSubscription = asynchandler(async (req, res) => {
    const { salonOwnerId, duration } = req.body;
    if (!salonOwnerId) {
        response.validationError(res, 'Salon owner id  is required');
    }
    const findSubScription = await subscriptionDB.findOne({ salonOwnerId: salonOwnerId });
    if (!findSubScription) {
        const currentDate = new Date()
        const futureDate = new Date();
        futureDate.setMonth(currentDate.getMonth() + duration);

        const formattedCurrentDate = currentDate.toISOString().slice(0, 10);
        const formattedFutureDate = futureDate.toISOString().slice(0, 10);
        const newSubscription = new subscriptionDB({
            salonOwnerId: salonOwnerId,
            startDate: formattedCurrentDate,
            endDate: formattedFutureDate,
            status: "PENDING APPROVAL",
            paymentStatus: "PENDING"

        })
        const savedSubsciption = await newSubscription.save();
        if (savedSubsciption) {
            const updateSalonOwner = await slaonOwnerDB.findByIdAndUpdate({ _id: salonOwnerId }, {
                subscriptionId: savedSubsciption._id
            }, { new: true })
            if (updateSalonOwner) {
                response.successResponse(res, savedSubsciption, "Saved the subscription successfully");

            }
            else {
                response.internalServerError(res, 'Cannot create a new subscription')
            }
        }
        else {
            response.internalServerError(res, 'Cannot create a new subscription')
        }
    }
    else {
        response.errorResponse(res, "Subscription for this id already exists.", 400);
    }


})

module.exports = { test ,createSubscription};