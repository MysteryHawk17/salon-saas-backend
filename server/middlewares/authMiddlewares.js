const jwt = require('jsonwebtoken');
const superAdminDb = require("../models/superadminModel");
const asyncHandler = require('express-async-handler');
require('dotenv').config();


const checkSuperAdmin = asyncHandler(async (req, res) => {
    var token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token, process.env.JWT_SECRET);
            console.log(decoded.id)
            req.superAdmin = await superAdminDb.findById({_id:decoded.id}).select('-password');
            console.log(req.superAdmin)
            console.log(req.body)
            if (req.superAdmin.email==req.body.email) {
                next();
            }
            else {
                res.status(401).json({ message: "The user is not an super admin " });
            }
        } catch (err) {
            res.status(401).json({ message: "Unauthorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "User not authorized" });
    }
})


module.exports={checkSuperAdmin};