const superAdminDb = require("../models/superadminModel");
const response = require("../middlewares/responseMiddlewares.js");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs")
const jwt = require('../utils/jwt')

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Superadmin routes established')
})

const createAdmin = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        response.validationError(res, 'Please enter valid details in all fields')
        return;
    }
    const findAdmin = await superAdminDb.findOne({ email: email });
    if (findAdmin) {
        response.errorResponse(res, "Admin account  already exists.Please login", 400);
        return;
    }
    else {

        const salt = await bcrypt.genSalt(10);
        console.log(password)
        const hashPassword = await bcrypt.hash(password, salt);
        console.log(hashPassword);

        const newAdmin = new superAdminDb({
            name: name,
            email: email,
            password: hashPassword,
        })
        const savedAdmin = await newAdmin.save();

        const token = jwt(savedAdmin._id);
        const { password, createdAt, updatedAt, ...other } = savedAdmin._doc;


        const data = {
            other,
            token: token
        }
        if (savedUser) {
            response.successResponse(res, data, "Admin created Successfully")
        }
        else {
            response.errorResponse(res, 'Error in creating Admin', 400);
        }

    }

})
const loginAdmin = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        response.validationError(res, "Please fill in the details properly")
    }
    else {
        const superAdmin = await superAdminDb.findOne({ email: email });
        if (superAdmin) {
            const comparePassword = await bcrypt.compare(password, superAdmin.password);
            if (comparePassword) {
                const token = jwt(superAdmin._id);
                const { password, createdAt, updatedAt, ...other } = superAdmin._doc;
                const data = {
                    other,
                    token: token
                }
                response.successResponse(res, data, "Login successful");

            }
            else {
                response.validationError(res, "Password incorrect");
            }

        }
        else {
            response.notFoundError(res, "Admin not found");
        }

    }
})


module.exports = { test ,createAdmin,loginAdmin};