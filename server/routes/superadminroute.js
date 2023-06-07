const { test, createAdmin, loginAdmin, getAllOwners, getASalonOwner, getAllSubscriptions, getASubscription, changeSubscriptionStatus } = require("../controllers/superadminController");

const router=require("express").Router();
const {checkSuperAdmin}=require("../middlewares/authMiddlewares")


router.get("/test",test)
router.post("/register",createAdmin);
router.post("/login",loginAdmin);
router.get("/getallowners",getAllOwners);
router.get('/getaowner/:id',getASalonOwner);
router.get("/getallsubscriptions",getAllSubscriptions);
router.get("/getasubscription/:subscriptionId",getASubscription);
router.patch('/updatesubscription/status/:subscriptionId',changeSubscriptionStatus);


module.exports=router;