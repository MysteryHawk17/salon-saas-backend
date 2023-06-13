const { test, createBranch, getAllBranch, getABranch, updateBranch, deleteBranch } = require("../controllers/branchControllers");

const router = require("express").Router();




router.get("/test", test);
router.post('/create', createBranch);
router.get('/getallbranch', getAllBranch);
router.get('/getbranch/:id', getABranch);
router.put("/updatebranch/:id", updateBranch);
router.delete("/deletebranch/:id", deleteBranch);




module.exports = router;