const { test, createClient, getAllClient, getClient, getClientByPhone, updateClient, deleteClient, searchClient } = require("../controllers/clientController");

const router = require("express").Router();



router.get('/test', test);
router.post("/create", createClient);
router.get("/getallclients", getAllClient);
router.get("/getclient/:id", getClient)
router.get("/getclientbynumber/:clientPhone", getClientByPhone);
router.put("/updateclient/:id", updateClient);
router.delete("/deleteclient/:id", deleteClient);
router.get("/searchclient",searchClient)

module.exports = router;