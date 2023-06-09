const serviceDB = require("../models/servicesModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddlewares");



const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "Services routes established");
})

const createService = asynchandler(async (req, res) => {
    const { serviceName, category, duration, price, membershipPrice, rewardPoints, serviceFor } = req.body;
    if (!serviceName || !category || !duration || !price || !membershipPrice || !rewardPoints || !serviceFor) {
        response.validationError(res, 'Please enter all the services');
    }
    const newService = new serviceDB({
        serviceName: serviceName,
        category: category,
        duration: duration,
        price: price,
        membershipPrice: membershipPrice,
        rewardPoints: rewardPoints,
        serviceFor: serviceFor
    })
    const savedService = await newService.save();
    if (savedService) {
        response.successResponse(res, savedService, 'Successfully saved the services');
    }
    else {
        response.internalServerError(res, 'Error in saving the response');
    }

})

const getAllServices = asynchandler(async (req, res) => {
    const { page, limit } = req.query;
    if (!page && !limit) {
        const allData = await serviceDB.find();
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the services");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the services');
        }
    }
    else if (!page) {
        const limitedResults = await serviceDB.find().limit(limit);
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {
        const allData = await serviceDB.find();

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
const getAService = asynchandler(async (req, res) => {
    const { serviceId } = req.params;
    if (!serviceId) {
        return response.validationError(res, 'Cannot find the service without its id');
    }
    const findService = await serviceDB.findById({ _id: serviceId });
    if (findService) {
        response.successResponse(res, findService, 'Successfully fetched the data');
    }
    else {
        response.notFoundError(res, 'Cannot fetch the service');
    }
})
const deleteService = asynchandler(async (req, res) => {
    const { serviceId } = req.params;
    if (!serviceId) {
        return response.validationError(res, 'Cannot find Service without its id');
    }
    const findService = await serviceDB.findById({ _id: serviceId });
    if (findService) {
        const deletedService = await serviceDB.findByIdAndDelete({ _id: serviceId });
        if (deletedService) {
            response.successResponse(res, deletedService, 'Service was deleted successfully');
        }
        else {
            response.internalServerError(res, 'Error deleting the Service');
        }
    }

    else {
        response.notFoundError(res, 'Cannot found the specified service');
    }
})


const updateService = asynchandler(async (req, res) => {
    const { serviceId } = req.params;
    if (!serviceId) {
        return response.validationError(res, 'Cannot find Service without its id');
    }
    const findService = await serviceDB.findById({ _id: serviceId });
    if (findService) {
        const updateData = {};
        const { serviceName, category, duration, price, membershipPrice, rewardPoints, serviceFor } = req.body;
        if (serviceName) {
            updateData.serviceName = serviceName;
        }
        if (category) {
            updateData.category = category;
        }
        if (duration) {
            updateData.duration = duration;
        }
        if (price) {
            updateData.price = price;
        }
        if (membershipPrice) {
            updateData.membershipPrice = membershipPrice;
        }
        if (rewardPoints) {
            updateData.rewardPoints = rewardPoints;
        }
        if (serviceFor) {
            updateData.serviceFor = serviceFor;
        }
        const updatedService = await serviceDB.findByIdAndUpdate({ _id: serviceId }, updateData, { new: true });
        if (updatedService) {
            response.successResponse(res, updatedService, 'Successfully updated the service');
        }
        else {
            response.internalServerError(res, 'Failed to update the service');
        }

    }

    else {
        response.notFoundError(res, 'Cannot found the specified service');
    }
})

const searchService=asynchandler(async(req,res)=>{
    const{serviceName}=req.query;
    const queryObj={};
    if(serviceName){
        queryObj.serviceName={$regex:serviceName,$options:'i'};
    }
    const findReselts=await serviceDB.find(queryObj);
    if(findReselts){
        response.successResponse(res,findReselts,'Fetched the searched results');

    }
    else{
        response.internalServerError(res,'Failed to fetch the results');
    }
})

module.exports = { test,createService,getAllServices,getAService,updateService ,deleteService,searchService};