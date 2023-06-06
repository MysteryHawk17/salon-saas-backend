const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();
const bodyParser = require("body-parser");

//routes imports
const superAdminRoutes=require('./routes/superadminroute')
const salonOwnerRotes=require("./routes/salonOwnerRoutes")
//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(cors());

//route middlewares
app.use("/api/superadmin",superAdminRoutes)
app.use("/api/salonowner",salonOwnerRotes);
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

