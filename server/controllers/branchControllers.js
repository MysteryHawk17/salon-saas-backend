const branchDB = require("../models/branchModel");
const response = require("../middlewares/responseMiddlewares");
const asynchandler = require("express-async-handler");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Successfully established the branch routes');
})


const createBranch = asynchandler(async (req, res) => {
    const { branchName, branchManagerName, poc, address } = req.body;
    if (!branchName || !branchManagerName || poc == undefined || poc == null || !address) {
        return response.validationError(res, "Please enter all the fields");
    }
    const newBranch = new branchDB({
        branchName: branchName,
        branchManagerName: branchManagerName,
        poc: poc,
        address: address
    })
    const savedBranch = await newBranch.save();
    if (savedBranch) {
        response.successResponse(res, savedBranch, 'Saved brach successfully')
    }
    else {
        response.internalServerError(res, 'Failed to save branch');
    }

})

const getAllBranch = asynchandler(async (req, res) => {
    const { page, limit } = req.query;

    if (!page && !limit) {

        const allData = await branchDB.find()
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the branches");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the branches');
        }
    }
    else if (!page) {

        const limitedResults = await branchDB.find().limit(limit)
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {

        const allData = await branchDB.find()

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

const getABranch = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find data without the id');
    }
    const findResult = await branchDB.findById({ _id: id });
    if (findResult) {
        response.successResponse(res, findResult, 'Successfully fetched the branch');
    }
    else {
        response.notFoundError(res, 'Failed to fetch the branch ');
    }
})

const updateBranch = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find data without the id');
    }
    const findResult = await branchDB.findById({ _id: id });
    if (findResult) {
        const updateData = {};
        const { branchName, branchManagerName, poc, address } = req.body;
        if (branchName) {
            updateData.branchName = branchName;
        }
        if (branchManagerName) {
            updateData.branchManagerName = branchManagerName;
        }
        if (poc) {
            updateData.poc = poc;
        }
        if (address) {
            updateData.address = address;
        }
        const updatedBranch = await branchDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedBranch) {
            response.successResponse(res, updatedBranch, 'Successfully updated the data');
        }
        else {
            response.internalServerError(res, 'Failed to update the branch');
        }
    }
    else {
        response.notFoundError(res, 'Failed to fetch the branch ');
    }
})

const deleteBranch = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find data without the id');
    }
    const findResult = await branchDB.findById({ _id: id });
    if (findResult) {
        const deletedBranch = await branchDB.findByIdAndDelete({ _id: id });

        if (deletedBranch) {
            response.successResponse(res, deletedBranch, 'Successfully deleted the data');
        }
        else {
            response.internalServerError(res, 'Failed to deleted the branch');
        }
    }
    else {
        response.notFoundError(res, 'Failed to fetch the branch ');
    }
})
module.exports = { test ,createBranch,getAllBranch,getABranch,updateBranch,deleteBranch};