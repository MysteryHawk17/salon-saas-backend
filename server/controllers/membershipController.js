const membershipDB = require("../models/membershipModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddlewares")

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Membership routes established');
})


const createMembership = asynchandler(async (req, res) => {
    const { membershipName, membershipPrice, duration, condition, rewardPointsOnPurchase, discountOnService, discountOnProducts, discountOnPackage, minBilledAmount, rewardPointsBoost, minRewardPointsEarn } = req.body;
    if (!membershipName || !membershipPrice || !duration || !condition || !rewardPointsOnPurchase || !discountOnService || !discountOnProducts || !discountOnPackage || !minBilledAmount || !rewardPointsBoost || !minRewardPointsEarn) {
        response.validationError(res, 'Please enter all the fields');
        return;
    }
    const newMembership = new membershipDB({
        membershipName,
        membershipPrice,
        duration,
        condition,
        rewardPointsOnPurchase,
        discountOnService,
        discountOnProducts,
        discountOnPackage,
        minBilledAmount,
        rewardPointsBoost,
        minRewardPointsEarn
    })
    const savedMembership = await newMembership.save();
    if (savedMembership) {
        response.successResponse(res, savedMembership, 'Successfully saved the membership');
    }
    else {
        response.internalServerError(res, 'Failed to save the membership');
    }
})

const getAllMemberships = asynchandler(async (req, res) => {
    const { page, limit } = req.query;
    if (!page && !limit) {
        const allData = await membershipDB.find();
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the memberships");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the memberships');
        }
    }
    else if (!page) {
        const limitedResults = await membershipDB.find().limit(limit);
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {
        const allData = await membershipDB.find();

        if (allData) {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const result = allData.slice(startIndex, endIndex);
            const finalResult = {
                result: result,
                totalPage: Math.ceil(allData.length / limit)
            }
            response.successResponse(res, finalResult, 'Fetched the data succeessfully');
        }
        else {
            response.internalServerError(res, 'Unable to fetch the data');
        }
    }
})
const getMembershipDetails = asynchandler(async (req, res) => {
    const { membershipId } = req.params;
    if (!membershipId) {
        return response.validationError(res, 'Cannot find the membership without its id');
    }
    const findMembership = await membershipDB.findById({ _id: membershipId });
    if (findMembership) {
        response.successResponse(res, findMembership, 'Successfully fetched the data');
    }
    else {
        response.notFoundError(res, 'Cannot fetch the membership');
    }
})
const deleteMembership = asynchandler(async (req, res) => {
    const { membershipId } = req.params;
    if (!membershipId) {
        return response.validationError(res, 'Cannot find Membership without its id');
    }
    const findMembership = await membershipDB.findById({ _id: membershipId });
    if (findMembership) {
        const deletedMembership = await membershipDB.findByIdAndDelete({ _id: membershipId });
        if (deletedMembership) {
            response.successResponse(res, deletedMembership, 'Membership was deleted successfully');
        }
        else {
            response.internalServerError(res, 'Error deleting the Membership');
        }
    }

    else {
        response.notFoundError(res, 'Cannot found the specified membership');
    }
})

const updateMembership = asynchandler(async (req, res) => {
    const { membershipId } = req.params;
    if (!membershipId) {
        return response.validationError(res, 'Cannot find membership without its id');
    }
    const findMembership = await membershipDB.findById({ _id: membershipId });
    if (findMembership) {
        const updateData = {};
        const { membershipName, membershipPrice, duration, condition, rewardPointsOnPurchase, discountOnService, discountOnProducts, discountOnPackage, minBilledAmount, rewardPointsBoost, minRewardPointsEarn } = req.body;
        if (membershipName) {
            updateData.membershipName = membershipName;
        }
        if (membershipPrice) {
            updateData.membershipPrice = membershipPrice;
        }
        if (duration) {
            updateData.duration = duration;
        }
        if (condition) {
            updateData.condition = condition;
        }
        if (rewardPointsOnPurchase
        ) {
            updateData.rewardPointsOnPurchase = rewardPointsOnPurchase;
        }
        if (discountOnService) {
            updateData.discountOnService = discountOnService;
        }
        if (discountOnProducts) {
            updateData.discountOnProducts = discountOnProducts;
        }
        if (discountOnPackage) {
            updateData.discountOnPackage = discountOnPackage;
        }
        if (minBilledAmount) {
            updateData.minBilledAmount = minBilledAmount;
        }
        if (rewardPointsBoost) {
            updateData.rewardPointsBoost = rewardPointsBoost;
        }
        if (minRewardPointsEarn) {
            updateData.minRewardPointsEarn = minRewardPointsEarn;
        }
        const updatedMembership = await membershipDB.findByIdAndUpdate({ _id: membershipId }, updateData, { new: true });
        if (updatedMembership) {
            response.successResponse(res, updatedMembership, 'Successfully updated the membership');
        }
        else {
            response.internalServerError(res, 'Failed to update the membership');
        }

    }

    else {
        response.notFoundError(res, 'Cannot found the specified membership');
    }
})




const searchMembership = asynchandler(async (req, res) => {
    const { membershipName } = req.query;
    const queryObj = {};
    if (membershipName) {
        queryObj.membershipName = { $regex: membershipName, $options: 'i' };
    }
    const findReselts = await membershipDB.find(queryObj);
    if (findReselts) {
        response.successResponse(res, findReselts, 'Fetched the searched results');

    }
    else {
        response.internalServerError(res, 'Failed to fetch the results');
    }
})


module.exports = { test ,createMembership,getAllMemberships,getMembershipDetails,searchMembership,updateMembership,deleteMembership};