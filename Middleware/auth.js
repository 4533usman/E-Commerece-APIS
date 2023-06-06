const ErrorHandler = require("../utiles/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler("Please LogIn To Access This Resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)

    next()

});

exports.authorizedRole = (...roles) => {

    return (req, res, next) => {

        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403))
        }

        next();

    }

}