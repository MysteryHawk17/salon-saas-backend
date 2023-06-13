const { test, createService, getAllServices, getAService, updateService, deleteService, searchService, getServicesByBranch } = require("../controllers/serviceController");

const router=require("express").Router();




router.get("/test",test);
router.post('/create',createService);
router.get('/getallservice',getAllServices);
router.get("/getaservice/:serviceId",getAService);
router.put("/updateservice/:serviceId",updateService);
router.delete("/deleteservice/:serviceId",deleteService);
router.get("/searchservice",searchService)
router.get("/getallservicebybranch/:branchId",getServicesByBranch);


module.exports=router;