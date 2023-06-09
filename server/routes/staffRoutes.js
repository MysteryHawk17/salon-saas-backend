
const { test, createStaff, getAllStaff, getAStaff, updateStaff, updateProfilePic, updateIdProof, deleteStaff, searchStaff } = require("../controllers/staffController");

const router = require("express").Router();
const upload = require("../utils/multer")


router.get("/test", test);
router.post('/create', upload.array("images"), createStaff);
router.get("/getallstaff", getAllStaff);
router.get('/getastaff/:staffId', getAStaff)
router.put("/editdetails/:staffId", updateStaff)
router.patch("/editprofilepic/:staffId", upload.array("images"), updateProfilePic)
router.patch('/editidproof/:staffId', upload.array("images"), updateIdProof);
router.delete('/deletestaff/:staffId', deleteStaff);
router.get("/searchstaff", searchStaff)



module.exports = router;