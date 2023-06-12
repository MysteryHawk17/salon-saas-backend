const clientDB = require("../models/clientModel");
const response = require("../middlewares/responseMiddlewares");
const asynchandler = require("express-async-handler");


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Client routes established');
})

const createClient = asynchandler(async (req, res) => {
    const { clientName, clientNumber, clientEmail, clientAddress, gender } = req.body;
    if (!clientName || !gender || !clientNumber) {
        response.validationError(res, "Please enter the required field");
        return;
    }
    const findClient = await clientDB.findOne({ clientNumber: clientNumber });
    if (findClient) {
        return response.errorResponse(res, 'Client already exists. ', 400);
    }
    const newClient = new clientDB({
        clientName,
        clientNumber,
        clientEmail: clientEmail,
        clientAddress: clientAddress,
        gender: gender,
        appointmentDetails: [],
    })
    const savedClient = await newClient.save();
    if (savedClient) {
        response.successResponse(res, savedClient, 'Successfully saved the client');
    }
    else {
        response.internalServerError(res, 'Failed to save the client.')
    }
})

const getAllClient = asynchandler(async (req, res) => {
    const { page, limit } = req.query;
    if (!page && !limit) {
        const allData = await clientDB.find().populate("membershipDetails").populate("appointmentDetails");
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the clients");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the clients');
        }
    }
    else if (!page) {
        const limitedResults = await clientDB.find().limit(limit).populate("membershipDetails").populate("appointmentDetails");
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {
        const allData = await clientDB.find().populate("membershipDetails").populate("appointmentDetails");

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

const getClient = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response.validationError(res, 'Error in finding the client without id');
    }
    const findClient = await clientDB.findById({ _id: id }).populate("membershipDetails").populate("appointmentDetails");
    if (findClient) {
        response.successResponse(res, findClient, 'Successfully found the client');
    }
    else {
        response.notFoundError(res, 'Unable to find the client');
    }
})

const getClientByPhone = asynchandler(async (req, res) => {
    const { clientNumber } = req.params;
    if (!clientNumber) {
        return response.validationError(res, 'Error in finding the client without phone');
    }
    const findClient = await clientDB.findOne({ clientNumber: clientNumber }).populate("membershipDetails").populate("appointmentDetails");
    if (findClient) {
        response.successResponse(res, findClient, 'Successfully found the client');
    }
    else {
        response.notFoundError(res, 'Unable to find the client');
    }
})

const deleteClient = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response.validationError(res, 'cannot delete client without the id');
    }
    const findClient = await clientDB.findById({ _id: id });
    if (findClient) {
        const deletedClient = await clientDB.findByIdAndDelete({ _id: id });
        if (deletedClient) {
            response.successResponse(res, deletedClient, 'Successfully deleted the client');
        }
        else {
            response.internalServerError(res, 'Failed to delete the client');
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the client');
    }

})

const updateClient = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response.validationError(res, 'cannot delete client without the id');
    }
    const findClient = await clientDB.findById({ _id: id });
    if (findClient) {
        const updateData = {};
        const { clientName, clientNumber, clientEmail, clientAddress, gender } = req.body;
        if (clientName) {
            updateData.clientName = clientName;
        }
        if (clientNumber) {
            updateData.clientNumber = clientNumber;
        }
        if (clientEmail) {
            updateData.clientEmail = clientEmail;
        }
        if (clientAddress) {
            updateData.clientAddress = clientAddress;
        }
        if (gender) {
            updateData.gender = gender;
        }
        const updatedClient = await clientDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedClient) {
            response.successResponse(res, updatedClient, 'Successfully updated the client');
        }
        else {
            response.internalServerError(res, 'Failed to update the client')
        }

    }
    else {
        response.notFoundError(res, 'Cannot find the client');
    }
})


const searchClient = asynchandler(async (req, res) => {
    const { clientName, clientNumber, clientEmail } = req.query;
    const queryObj = {};
    if (clientName) {
        queryObj.clientName = { $regex: clientName, $options: 'i' };
    }
    if (clientNumber) {
        queryObj.clientNumber = clientNumber;
    }
    if (clientEmail) {
        queryObj.clientEmail = clientEmail;
    }
    const findReselts = await clientDB.find(queryObj).populate("membershipDetails").populate("appointmentDetails");
    if (findReselts) {
        response.successResponse(res, findReselts, 'Fetched the searched results');

    }
    else {
        response.internalServerError(res, 'Failed to fetch the results');
    }
})

const buyMembership = asynchandler(async (req, res) => {
    const { membershipId } = req.body;
    const { clientId } = req.params
    if (!membershipId || !userId) {
        return response.validationError(res, 'Provide all the details properly');
    }
    const findClient = await clientDB.findById({ _id: clientId });
    if (findClient) {
        const updatedClient = await clientDB.findByIdAndUpdate({ _id: clientId }, {
            membershipDetails: membershipId
        }, { new: true });
        if (updatedClient) {
            response.successResponse(res, updatedClient, 'Successfully updated the client');
        }
        else {
            response.internalServerError(res, 'Cannot update the client');
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the client');
    }
})
module.exports = { test, createClient, getAllClient, getClient, updateClient, deleteClient, getClientByPhone, searchClient, buyMembership };