const ErrorHandler = require("../utiles/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utiles/jwtToken");
const sendEmail = require("../utiles/sendEmail");
const crypto = require("crypto");
const res = require("express/lib/response");


//Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "Sample Image Id",
            url: "sample Url"
        }
    })


    sendToken(user, 201, res)
})

//Login a User

exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;
    //checking whether the email and password is exis in the database
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email or Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    //sending response to the User

    sendToken(user, 200, res)
})
//logout the User

exports.logOut = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    })
})

//Forgot Password 

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("User Not Found", 404))
    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecomerce Password Recoverey",
            message
        });
        res.status(200).json({
            success: true,
            message: `Email Sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//Get User Detail

exports.getUserDetail = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

//Update User Password 

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is Incorrect"), 400)
    }
    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHandler("Password Does Not Matched", 400))
    }
    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res)
})

//Update User Profile

exports.updateUser = catchAsyncError(async (req, res, next) => {
    const updateData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
        user
    })
})

//Get All User --Admin

exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const user = await User.find();

    res.status(200).json({
        success: true,
        user
    })
})

//Get All User --Admin

exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User is Not Exist With Id : ${req.params.id}`,404))
    }

    res.status(200).json({
        success : true,
        user
    })
})

//Update User Role

exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
        user
    })
})
// Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
  
    // const imageId = user.avatar.public_id;
  
    // await cloudinary.v2.uploader.destroy(imageId);
  
    await user.remove();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });