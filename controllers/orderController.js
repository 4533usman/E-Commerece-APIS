const ErrorHandler = require("../utiles/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

//Create an Order

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get Single Order

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  )

  if (!order) {
    return next(new ErrorHandler("Order Is Not Found ", 404))
  }

  res.status(200).json({
    success: true,
    order
  })
})

// get logged in user  Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//Get All Orders --Admin

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0

  orders.forEach((order) => {
    totalAmount += order.totalPrice
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount
  })
})

//Update OrderStatus

exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }
  if (order.status === "Delivered") {
    return next(new ErrorHandler("You Have Already Delivered This Order", 400))
  }
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
})


async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

//Delete a Order

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});