const asynchandler = require('express-async-handler');
const response = require("../middlewares/responseMiddlewares");
const productDB = require("../models/productsModel");
const sendmail = require("../utils/sendmail");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Product route established');
})

const createProduct = asynchandler(async (req, res) => {
    const { productName, mrp, volume, unit, barcode, rewardPoints, branchDetails } = req.body;
    if (!productName || !mrp || !volume || !unit || !barcode || !rewardPoints || !branchDetails) {
        response.validationError(res, 'Please enter all the fields');
        return;
    }
    const newProduct = new productDB({
        productName,
        mrp,
        volume,
        unit,
        barcode,
        rewardPoints,
        branchDetails
    })
    const savedProduct = await newProduct.save();
    if (savedProduct) {
        response.successResponse(res, savedProduct, 'Successfully saved the product');
    }
    else {
        response.internalServerError(res, 'Failed to save the product');
    }
})

const getAllProducts = asynchandler(async (req, res) => {
    const { page, limit } = req.query;
    if (!page && !limit) {
        const allData = await productDB.find().populate("branchDetails");
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the products");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the products');
        }
    }
    else if (!page) {
        const limitedResults = await productDB.find().limit(limit).populate("branchDetails");
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {
        const allData = await productDB.find().populate("branchDetails");

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
const getAProduct = asynchandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return response.validationError(res, 'Cannot find the product without its id');
    }
    const findProduct = await productDB.findById({ _id: productId }).populate("branchDetails");
    if (findProduct) {
        response.successResponse(res, findProduct, 'Successfully fetched the data');
    }
    else {
        response.notFoundError(res, 'Cannot fetch the product');
    }
})
const deleteProduct = asynchandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return response.validationError(res, 'Cannot find Product without its id');
    }
    const findProduct = await productDB.findById({ _id: productId }).populate("branchDetails");
    if (findProduct) {
        const deletedProduct = await productDB.findByIdAndDelete({ _id: productId });
        if (deletedProduct) {
            response.successResponse(res, deletedProduct, 'Product was deleted successfully');
        }
        else {
            response.internalServerError(res, 'Error deleting the Product');
        }
    }

    else {
        response.notFoundError(res, 'Cannot found the specified service');
    }
})


const updateProduct = asynchandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return response.validationError(res, 'Cannot find product without its id');
    }
    const findProduct = await productDB.findById({ _id: productId }).populate("branchDetails");
    if (findProduct) {
        const updateData = {};
        const { productName, mrp, volume, unit, barcode, rewardPoints } = req.body;
        if (productName) {
            updateData.productName = productName;
        }
        if (mrp) {
            updateData.mrp = mrp;
        }
        if (volume) {
            updateData.volume = volume;
        }
        if (unit) {
            updateData.unit = unit;
        }
        if (barcode) {
            updateData.barcode = barcode;
        }
        if (rewardPoints) {
            updateData.rewardPoints = rewardPoints;
        }
        const updatedProduct = await productDB.findByIdAndUpdate({ _id: productId }, updateData, { new: true });
        if (updatedProduct) {
            response.successResponse(res, updatedProduct, 'Successfully updated the service');
        }
        else {
            response.internalServerError(res, 'Failed to update the service');
        }

    }

    else {
        response.notFoundError(res, 'Cannot found the specified service');
    }
})




const searchProduct = asynchandler(async (req, res) => {
    const { productName } = req.query;
    const queryObj = {};
    if (productName) {
        queryObj.productName = { $regex: productName, $options: 'i' };
    }
    const findReselts = await productDB.find(queryObj).populate("branchDetails");
    if (findReselts) {
        response.successResponse(res, findReselts, 'Fetched the searched results');

    }
    else {
        response.internalServerError(res, 'Failed to fetch the results');
    }
})

const updateQuantity = asynchandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return response.validationError(res, 'Cannot find product without its id');
    }
    const findProduct = await productDB.findById({ _id: productId });
    if (findProduct) {
        const finalQuantity = req.body.quantity;
        const update = {};
        if (finalQuantity) {
            update.unit = finalQuantity;
        }
        const updatedProductQuantity = await productDB.findByIdAndUpdate({ _id: productId }, update, { new: true });
        if (updatedProductQuantity && finalQuantity < 5) {
            const { email, name } = req.salonOwner
            const subject = `Update on inventory for product ${updatedProductQuantity.productName}`;
            const send_to = email
            const sent_from = process.env.EMAIL_USER
            const message =
                `<h2>Hello ${name} </h2>
        <p>This is to inform you that your product ${updatedProductQuantity.productName} has only ${updatedProductQuantity.unit} left.</p>
        <p>Restock the unit to continue the services efficiently.</p>
        <p>Regards</p>`;
            try {
                await sendmail(subject, message, send_to, sent_from);
                response.successResponse(res, updatedProductQuantity, "Successfully sent the mail and updated the quantity");
            } catch {
                response.internalServerError(res, 'Not able to send the mail');
            }

        }
        else if (updatedProductQuantity) {
            response.successResponse(res, updatedProductQuantity, "Successfully updated the quantity");
        }
        else {
            response.internalServerError(res, 'Failed to update the product quantity');
        }
    }
    else {
        response.notFoundError(res, 'Cannot found the specified service');
    }

})

const getProductByBranch = asynchandler(async (req, res) => {
    const { branchId } = req.params;
    if (branchId == ':branchId') {
        return response.validationError(res, "Cannot get a branch without its id");
    }
    const { page, limit } = req.query;
    if (!page && !limit) {
        const allData = await productDB.find({ branchDetails: branchId }).populate("branchDetails");
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the datas");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the datas');
        }
    }
    else if (!page) {
        const limitedResults = await productDB.find({ branchDetails: branchId }).limit(limit).populate("branchDetails");
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {
        const allData = await productDB.find({ branchDetails: branchId }).populate("branchDetails");

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
module.exports = { test, createProduct, getAProduct, getAllProducts, deleteProduct, updateProduct, updateQuantity, searchProduct ,getProductByBranch};