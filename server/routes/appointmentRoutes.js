const { test, createAppointment, updateAppointmentStatus, getPrice, getAllAppointment, getParticularAppointment, searchAPIAppointment, updateAppointmentDetails, getAppointmentsByBranch } = require("../controllers/appointmentController");

const router=require("express").Router();



router.get("/test",test);
router.post("/create",createAppointment);
router.patch('/updateappointmentstatus/:appointmentId',updateAppointmentStatus)
router.put('/updateappointmentdetails/:appointmentId',updateAppointmentDetails)
router.get('/getprice',getPrice)
router.get("/getallappointments",getAllAppointment);
router.get("/getappointment/:appointmentId",getParticularAppointment);
router.get("/searchappointment",searchAPIAppointment);
router.get('/getappointmentbybranch/:branchId',getAppointmentsByBranch);

module.exports=router;