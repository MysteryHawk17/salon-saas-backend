const { test, createSubscription } = require("../controllers/subscriptionController");

const router=require("express").Router();






router.get("/test",test);
router.post("/create/subscription",createSubscription);



module.exports=router;