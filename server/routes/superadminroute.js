const { test, createAdmin, loginAdmin } = require("../controllers/superadminController");

const router=require("express").Router();



router.get("/test",test)
router.post("/register",createAdmin);
router.post("/login",loginAdmin);


module.exports=router;