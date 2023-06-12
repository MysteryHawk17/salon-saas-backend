const { test, createMembership, getAllMemberships, getMembershipDetails, updateMembership, deleteMembership, searchMembership } = require("../controllers/membershipController");

const router = require("express").Router();





router.get("/test", test);
router.post("/create", createMembership);
router.get("/getallmemberships", getAllMemberships);
router.get('/getmembership/:membershipId', getMembershipDetails);
router.put('/updatemembership/:membershipId', updateMembership);
router.delete('/deletemembership/:membershipId', deleteMembership);
router.get("/searchmembership", searchMembership)


module.exports = router;