const { test, createOwner, loginOwner, updateKyc } = require('../controllers/salonOwnerController');

const router=require('express').Router();
const upload=require("../utils/multer")


router.get("/test",test)
router.post("/register",createOwner);
router.post("/login",loginOwner);
router.patch("/updatekyc",upload.single('image'),updateKyc);


module.exports=router