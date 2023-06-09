const appointmentDB = require("../models/appointmentModel");
const clientDB = require("../models/clientModel");
const serviceDB = require("../models/servicesModel")
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddlewares");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Appointment routes established');
})

const createAppointment = asynchandler(async (req, res) => {
    const { clientName, clientNumber, timeOfAppointment, sourceOfAppointment, serviceProvider, serviceFor, serviceSelected, durationOfAppointment, appointmentStatus, giveRewardPoints, subTotal, discount, totalAmount, paidDues, advancedGiven, dateOfAppointment, branchDetails } = req.body;
    console.log(req.body);
    if (!clientName ||
        !clientNumber ||
        !timeOfAppointment ||
        !sourceOfAppointment ||
        !serviceProvider ||
        !serviceFor ||
        !serviceSelected ||
        !durationOfAppointment ||
        !appointmentStatus ||
        !giveRewardPoints ||
        !branchDetails ||
        subTotal === undefined ||
        subTotal === null ||
        discount === undefined ||
        discount === null ||
        totalAmount === undefined ||
        totalAmount === null ||
        paidDues === undefined ||
        paidDues === null ||
        advancedGiven === undefined ||
        advancedGiven == null ||
        !dateOfAppointment) {
        return response.validationError(res, 'Please enter the required details');
    }
    const newAppointment = new appointmentDB({
        clientName,
        clientNumber,
        timeOfAppointment,
        sourceOfAppointment,
        serviceProvider,
        serviceFor,
        serviceSelected,
        durationOfAppointment,
        appointmentStatus,
        giveRewardPoints,
        subTotal,
        discount,
        totalAmount,
        paidDues,
        advancedGiven,
        dateOfAppointment,
        branchDetails
    })
    const savedAppointment = await newAppointment.save();
    const updateClient = await clientDB.findOneAndUpdate({ clientNumber: clientNumber }, {
        $push: { appointmentDetails: savedAppointment._id }
    })
    console.log(updateClient);
    if (!updateClient) {
        return response.internalServerError(res, 'Created appointment but faiiled to update client')
    }
    if (savedAppointment && updateClient) {
        response.successResponse(res, savedAppointment, 'Successfully created the appointments')
    }
    else {
        response.internalServerError(res, 'Failed to create a appointment');
    }
})


const getPrice = asynchandler(async (req, res) => {
    const { serviceSelected, clientNumber } = req.body;
    if (!serviceSelected || !clientNumber) {
        return response.validationError(res, 'Please enter all the details');

    }
    const findClient = await clientDB.findOne({ clientNumber: clientNumber }).populate('membershipDetails').populate("branchDetails");
    if (!findClient) {
        return response.validationError(res, 'Client doesnot exist');
    }
    const findMembership = findClient.membershipDetails;
    var price = 0;
    const findService = await serviceDB.findById({ _id: serviceSelected });
    if (findMembership) {
        const discount = findMembership.discountOnService;
        price = findService.price - (discount / 100 * findService.price);

    }
    else {
        price = findService.price;
    }
    const data = {
        price: price
    }
    response.successResponse(res, data, "Price fetched");

})
const updateAppointmentStatus = asynchandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { appointmentStatus } = req.body;
    const findAppointment = await appointmentDB.findById({ _id: appointmentId });
    if (findAppointment) {
        const updatedAppointmentStatus = await appointmentDB.findByIdAndUpdate({ _id: appointmentId }, {
            appointmentStatus: appointmentStatus
        }, { new: true });
        if (updatedAppointmentStatus) {
            response.successResponse(res, updatedAppointmentStatus, 'Successfully updated the appointment status');
        }
        else {
            response.internalServerError(res, 'Failed the update the appointment status')
        }
    }
    else {
        response.notFoundError(res, 'Cannot found the specified appointment');
    }
})

const updateAppointmentDetails = asynchandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { timeOfAppointment, serviceProvider, serviceFor, serviceSelected, durationOfAppointment, giveRewardPoints, subtotal, discount, totalAmount, paidDues, advancedGiven, dateOfAppointment } = req.body;
    console.log(req.body);
    const findAppointment = await appointmentDB.findById({ _id: appointmentId });
    if (findAppointment) {
        const updateData = {};
        if (timeOfAppointment) {
            updateData.timeOfAppointment = timeOfAppointment
        }
        if (serviceProvider) {
            updateData.serviceProvider = serviceProvider
        }
        if (serviceFor) {
            updateData.serviceFor = serviceFor
        }
        if (serviceSelected) {
            updateData.serviceSelected = serviceSelected
        }
        if (durationOfAppointment) {
            updateData.durationOfAppointment = durationOfAppointment
        }
        if (giveRewardPoints) {
            updateData.giveRewardPoints = giveRewardPoints
        }
        if (subtotal) {
            updateData.subtotal = subtotal
        }
        if (discount) {
            updateData.discount = discount
        }
        if (totalAmount) {
            updateData.totalAmount = totalAmount
        }
        if (paidDues) {
            updateData.paidDues = paidDues
        }
        if (advancedGiven) {
            updateData.advancedGiven = advancedGiven
        }
        if (dateOfAppointment) {
            updateData.dateOfAppointment = dateOfAppointment
        }
        const updatedAppointmentStatus = await appointmentDB.findByIdAndUpdate({ _id: appointmentId }, updateData, { new: true });
        if (updatedAppointmentStatus) {
            response.successResponse(res, updatedAppointmentStatus, 'Successfully updated the appointment');
        }
        else {
            response.internalServerError(res, 'Failed the update the appointment')
        }
    }
    else {
        response.notFoundError(res, 'Cannot found the specified appointment');
    }
})

const getAllAppointment = asynchandler(async (req, res) => {
    const { page, limit } = req.query;
    if (!page && !limit) {
        const allData = await appointmentDB.find().populate("serviceProvider").populate("serviceSelected").populate("branchDetails");
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the appointments");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the appointments');
        }
    }
    else if (!page) {
        const limitedResults = await appointmentDB.find().limit(limit).populate("serviceProvider").populate("serviceSelected").populate("branchDetails");
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {
        const allData = await appointmentDB.find().populate("serviceProvider").populate("serviceSelected").populate("branchDetails");

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
const getParticularAppointment = asynchandler(async (req, res) => {
    const { appointmentId } = req.params;
    if (!appointmentId) {
        return response.validationError(res, 'Cannot find an appointment without its id ');
    }
    const findAppointment = await appointmentDB.findById({ _id: appointmentId }).populate("branchDetails").populate("serviceProvider").populate("serviceSelected");
    if (findAppointment) {
        response.successResponse(res, findAppointment, 'Successfully found the appointment');
    }
    else {
        response.notFoundError(res, 'Cannot find the specified appointment')
    }

})
const getUsersAppointment = asynchandler(async (req, res) => {
    const { clientNumber } = req.params;
    const { page, limit } = req.query;
    if (!page && !limit) {
        const allData = await appointmentDB.find({ clientNumber: clientNumber }).populate("serviceProvider").populate("serviceSelected").populate("branchDetails");
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the appointments");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the appointments');
        }
    }
    else if (!page) {
        const limitedResults = await appointmentDB.find().limit(limit).populate("serviceProvider").populate("serviceSelected").populate("branchDetails");
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {
        const allData = await appointmentDB.find().populate("serviceProvider").populate("serviceSelected").populate("branchDetails");

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


const searchAPIAppointment = asynchandler(async (req, res) => {
    const { clientName, clientNumber } = req.query;
    const queryObj = {};
    if (clientName) {
        queryObj.clientName = { $regex: clientName, $options: 'i' };
    }
    if (clientNumber) {
        queryObj.clientNumber = clientNumber;
    }
    const findAppointment = await appointmentDB.find(queryObj).populate("serviceProvider").populate("serviceSelected").populate("branchDetails");
    if (findAppointment) {
        response.successResponse(res, findAppointment, 'Successfully fetched the data');
    }
    else {
        response.internalServerError(res, 'Failed to fetch the datas');
    }
})


const getAppointmentsByBranch = asynchandler(async (req, res) => {
    const { branchId } = req.params;
    if (branchId == ':branchId') {
        return response.validationError(res, "Cannot get a branch without its id");
    }
    const { page, limit } = req.query;
    if (!page && !limit) {
        const allData = await appointmentDB.find({ branchDetails: branchId }).populate("serviceProvider").populate("serviceSelected").populate("branchDetails");
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the appointments");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the appointments');
        }
    }
    else if (!page) {
        const limitedResults = await appointmentDB.find({ branchDetails: branchId }).limit(limit).populate("serviceProvider").populate("serviceSelected").populate("branchDetails");
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {
        const allData = await appointmentDB.find({ branchDetails: branchId }).populate("serviceProvider").populate("serviceSelected").populate("branchDetails");

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
module.exports = { test, createAppointment, getPrice, updateAppointmentDetails, updateAppointmentStatus, getAllAppointment, getParticularAppointment, getUsersAppointment, searchAPIAppointment ,getAppointmentsByBranch};