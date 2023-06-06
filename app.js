const express = require("express");
const cookieParser = require("cookie-parser")
//importing the MiddleWare
const errormiddleware = require("./Middleware/Error")




const app = express();


//Route Import
app.use(express.json())
app.use(cookieParser());

//iMPORTING THE ROOUTES
const product = require("./route/productRoute")
const user = require("./route/userRoute")
const order = require("./route/orderRoute")

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

//USing the error Miiddleware
app.use(errormiddleware)

module.exports = app