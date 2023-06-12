const { test, createBill, getAllBills, getTotalSalesAmount, getAClientBill, updateBillStatus, deleteBill, searchBillAPI, updateBillDetails } = require("../controllers/billingController");

const router = require("express").Router();



router.get("/test", test);
router.post("/create", createBill);
router.get("/getallbills", getAllBills);
router.get("/gettotalsales", getTotalSalesAmount);
router.get("/getclientbill/:clientNumber", getAClientBill);
router.patch("/updatebillstatus/:billId", updateBillStatus)
router.put("/updatebilldetails/:billId", updateBillDetails)
router.delete("/deletebill/:billId", deleteBill);
router.get("/searchbill", searchBillAPI);

module.exports = router;