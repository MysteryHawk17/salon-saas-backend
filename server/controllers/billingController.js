const billingDB = require("../models/billingModel.js")
const clientDB = require("../models/clientModel.js");
const serviceDB = require("../models/servicesModel.js")
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddlewares.js");


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Billing routes established');
})

const createBill = asynchandler(async (req, res) => {
    const { clientName, clientNumber, quantity, timeOfBilling, price, billStatus, paymentDetails, serviceProvider, serviceFor, serviceSelected, durationOfAppointment, appointmentStatus, giveRewardPoints, subTotal, discount, totalAmount, paidDues, advancedGiven } = req.body;

    if (!clientName || !clientNumber || !quantity || !timeOfBilling || !price || !billStatus || !serviceProvider || !serviceFor || !serviceSelected || !durationOfAppointment || !appointmentStatus || !giveRewardPoints || subTotal === undefined || subTotal === null || discount === undefined || discount === null || totalAmount === undefined || totalAmount === null || paidDues === undefined || paidDues === null || advancedGiven===undefined||advancedGiven==null) {
        response.validationError(res, 'Fill in all the details');
        return;
    }
    const findClient = await clientDB.findOne({ clientNumber: clientNumber });

    if (findClient) {


        const newBill = new billingDB({
            clientName,
            clientNumber,
            quantity,
            timeOfBilling,
            price,
            billStatus,
            paymentDetails,
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
            advancedGiven
        })
        const savedBill = await newBill.save();
        if (savedBill) {
            const findService = await serviceDB.findById({ _id: serviceSelected });
            if (giveRewardPoints && billStatus == 'PAID') {
                const newRewardPoints = findClient.rewardPointsEarned + findService.rewardPoints;
                const updateClient = await clientDB.findOneAndUpdate({ clientNumber: clientNumber }, {
                    rewardPointsEarned: newRewardPoints
                }, { new: true });
                if (updateClient) {
                    response.successResponse(res, savedBill, 'Bill generated and paid successfully');
                }
                else {
                    response.internalServerError(res, "Bill generated successfully but cannot update the client");
                }
            }
            else {
                response.successResponse(res, savedBill, "Bill generated successfully");
            }
        }
        else {
            response.internalServerError(res, "Failed to generate the bill");
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the client');
    }

})
const getAllBills = asynchandler(async (req, res) => {
    const { page, limit, billStatus } = req.query;
    const queryObj = {};
    if (billStatus) {
        queryObj.billStatus = billStatus
    }
    if (!page && !limit) {

        const allData = await billingDB.find(queryObj).populate("serviceProvider").populate("serviceSelected");
        if (allData) {
            response.successResponse(res, allData, "Successfully fetched all the bills");

        }
        else {
            response.internalServerError(res, 'Error in fetching all the bills');
        }
    }
    else if (!page) {

        const limitedResults = await billingDB.find(queryObj).limit(limit).populate("serviceProvider").populate("serviceSelected");
        if (limitedResults) {
            response.successResponse(res, limitedResults, 'Successfully fetched the results');
        }
        else {
            response.internalServerError(res, 'Failed to fetch the responses');
        }

    }
    else if (page && limit) {

        const allData = await billingDB.find(queryObj).populate("serviceProvider").populate("serviceSelected");

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

const getAClientBill = asynchandler(async (req, res) => {
    const { clientNumber } = req.params;
    if (!clientNumber) {
        response.validationError(res, 'Cannot get a clients bill without the number');
        return;
    }
    const findAllBills = await billingDB.find({ clientNumber: clientNumber }).populate("serviceProvider").populate("serviceSelected");
    if (findAllBills) {
        response.successResponse(res, findAllBills, 'Successfully fetched all the bills');
    }
    else {
        response.internalServerError(res, 'Failed to fetch the bills');
    }
})

const getTotalSalesAmount = asynchandler(async (req, res) => {


    const result = await billingDB.aggregate([
        {
            $match: { billStatus: 'PAID' }
        },
        {
            $group: {
                _id: null,
                totalPaidAmounts: { $sum: '$totalAmount' }
            }
        }
    ]);
    if (result) {
        if (result.length > 0) {
            const totalPaidAmounts = result[0].totalPaidAmounts;
            console.log('Total Paid Amounts:', totalPaidAmounts);
            response.successResponse(res, totalPaidAmounts, 'Successfully fetched the total sales');
        } else {
            console.log('No paid bills found.');
            response.successResponse(res, 0, 'Successfully fetched the paid amounts');
        }
    }
    else {
        response.internalServerError(res, 'Cannot fetch the required data');
    }

})

const updateBillDetails = asynchandler(async (req, res) => {
    const { quantity, timeOfBilling, price, serviceProvider, serviceFor, serviceSelected, durationOfAppointment, appointmentStatus, giveRewardPoints, subtotal, discount, totalAmount, paidDues, advancedGiven } = req.body;
    const { billId } = req.params;
    if (!billId) {
        return response.validationError(res, 'Please enter all the fields');
    }
    const findBill = await billingDB.findById({ _id: billId });
    if (findBill) {
        const updateData = {};
        if (quantity) {
            updateData.quantity = quantity;
        }
        if (timeOfBilling) {
            updateData.timeOfBilling = timeOfBilling;
        }
        if (price) {
            updateData.price = price;
        }
        if (serviceProvider) {
            updateData.serviceProvider = serviceProvider;
        }
        if (serviceFor) {
            updateData.serviceFor = serviceFor;
        }
        if (serviceSelected) {
            updateData.serviceSelected = serviceSelected;
        }
        if (durationOfAppointment) {
            updateData.durationOfAppointment = durationOfAppointment;
        }
        if (appointmentStatus) {
            updateData.appointmentStatus = appointmentStatus;
        }
        if (giveRewardPoints) {
            updateData.giveRewardPoints = giveRewardPoints;
        }
        if (subtotal) {
            updateData.subtotal = subtotal;
        }
        if (discount) {
            updateData.discount = discount;
        }
        if (totalAmount) {
            updateData.totalAmount = totalAmount;
        }
        if (paidDues) {
            updateData.paidDues = paidDues;
        }
        if (advancedGiven) {
            updateData.advancedGiven = advancedGiven;
        }
        const updatedBill = await billingDB.findByIdAndUpdate({ _id: billId }, updateData, { new: true });
        if (updatedBill) {
            response.successResponse(res, updatedBill, 'Successfully update the bills')
        }
        else {
            response.internalServerError(res, 'Failed to update the bill');
        }

    }
    else {
        response.notFoundError(res, 'Cannot find the bills')
    }


})


const updateBillStatus = asynchandler(async (req, res) => {
    const { paymentDetails, paidDues, billStatus, giveRewardPoints } = req.body;
    const billId = req.params.billId;
    if (!billId) {
        return response.validationError(res, 'Cannnot find the bill id');
    }
    const findBill = await billingDB.findById({ _id: billId });
    if (findBill) {
        const updateData = {};
        if (paymentDetails) {
            updateData.paymentDetails = paymentDetails;

        }
        if (paidDues) {
            updateData.paidDues = paidDues;

        }
        if (billStatus) {
            updateData.billStatus = billStatus;

        }
        if (giveRewardPoints) {
            updateData.giveRewardPoints = giveRewardPoints;
        }
        const updatedBill = await billingDB.findByIdAndUpdate({ _id: billId }, updateData, { new: true });
        if (updatedBill) {
            const findService = await serviceDB.findById({ _id: updatedBill.serviceSelected });
            if (findService) {
                if (updatedBill.giveRewardPoints && updatedBill.billStatus == 'PAID') {
                    const client = await clientDB.findOne({ clientNumber: updatedBill.clientNumber });
                    const finalRewardPoint = client.rewardPointsEarned + findService.rewardPoints;
                    const updatedClient = await clientDB.findOneAndUpdate({ clientNumber: updatedBill.clientNumber }, { rewardPointsEarned: finalRewardPoint }, { new: true });
                    if (updatedClient) {
                        response.successResponse(res, updatedBill, 'Successfully updated  the bill');
                    }
                    else {
                        response.successResponse(res, updatedBill, 'Updated the bill but cannot update the client');
                    }

                }
                else {
                    response.successResponse(res, updatedBill, "Updated the bill successfully");
                }

            }

            else {
                response.internalServerError(res, 'Failed to fetch the service');
            }
        }

        else {
            response.internalServerError(res, 'Failed to update the bill')
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the specified bill')
    }
})

const deleteBill = asynchandler(async (req, res) => {
    const { billId } = req.params;
    if (!billId) {
        return response.validationError(res, 'Cannot delete bill if id is not given');
    }
    const findBill = await billingDB.findById({ _id: billId });
    if (findBill) {
        const deletedBill = await billingDB.findByIdAndDelete({ _id: billId });
        if (deletedBill) {
            response.successResponse(res, deletedBill, "Successfully deleted the bill.")
        }
        else {
            response.internalServerError(res, "Failed to delete the bill");
        }
    }
    else {
        response.notFoundError(res, "Cannot find the specified bill");
    }
})

const searchBillAPI = asynchandler(async (req, res) => {
    const { clientName, clientNumber } = req.query;
    const queryObj = {};
    if (clientName) {
        queryObj.clientName = { $regex: clientName, $options: 'i' };
    }
    if (clientNumber) {
        queryObj.clientNumber = clientNumber;
    }
    const findBill = await billingDB.find(queryObj);
    if (findBill) {
        response.successResponse(res, findBill, 'Successfully fetched the data');
    }
    else {
        response.internalServerError(res, 'Failed to fetch the datas');
    }
})
module.exports = { test, createBill, getAllBills, getAClientBill, getTotalSalesAmount, updateBillStatus, updateBillDetails, deleteBill, searchBillAPI };  