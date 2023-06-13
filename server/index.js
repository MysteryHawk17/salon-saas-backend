const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();
const bodyParser = require("body-parser");

//routes imports
const superAdminRoutes = require('./routes/superadminroute')
const salonOwnerRotes = require("./routes/salonOwnerRoutes")
const subscriptionRoutes = require("./routes/subscriptionRoutes")
const staffRoutes = require("./routes/staffRoutes");
const servicesRoutes = require("./routes/serviceRoutes");
const productRoutes = require("./routes/productRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const clientRoutes = require("./routes/clientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const billingRoutes = require("./routes/billingRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes")
const branchRoutes=require("./routes/branchRoutes");
//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(cors());

//route middlewares
app.use("/api/superadmin", superAdminRoutes)
app.use("/api/salonowner", salonOwnerRotes);
app.use("/api/subscription", subscriptionRoutes);
app.use('/api/staff', staffRoutes)
app.use('/api/service', servicesRoutes);
app.use("/api/products", productRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/billing", billingRoutes)
app.use("/api/feedback", feedbackRoutes);
app.use("/api/branch",branchRoutes)
//server test route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Saloon server is running" })

})
//connection to database
connectDB(process.env.MONGO_URI);

//server listenng 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

