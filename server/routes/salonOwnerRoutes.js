const { test, createOwner, loginOwner, updateKyc, cancelSubscription, updateDetails, getProfile } = require('../controllers/salonOwnerController');

const router = require('express').Router();
const upload = require("../utils/multer")


router.get("/test", test)
router.post("/register", createOwner);
router.post("/login", loginOwner);
router.patch("/updatekyc/:id", upload.single('image'), updateKyc);
router.put("/updatedetails/:id", updateDetails);
router.patch("/cancelsubscription/:ownerid", cancelSubscription)
router.get("/getprofile/:id", getProfile);

module.exports = router