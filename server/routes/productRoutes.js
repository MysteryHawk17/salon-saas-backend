const { test, createProduct, getAllProducts, getAProduct, updateProduct, deleteProduct, updateQuantity, searchProduct, getProductByBranch } = require("../controllers/productController");
const { checkLogin } = require("../middlewares/authMiddlewares");

const router=require("express").Router();



router.get("/test",test);
router.post("/create",createProduct);
router.get("/getallproducts",getAllProducts);
router.get('/getproduct/:productId',getAProduct);
router.put('/updateproduct/:productId',updateProduct);
router.delete('/deleteproduct/:productId',deleteProduct);
router.patch("/updatequantity/:productId",checkLogin,updateQuantity)
router.get("/searchproduct",searchProduct)
router.get("/getproductbybranch/:branchId",getProductByBranch);

module.exports=router;