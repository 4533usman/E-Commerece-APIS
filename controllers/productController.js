const Product = require("../models/productModel");
const ErrorHandler = require("../utiles/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");
const ApiFeature = require("../utiles/apiFeatures");
// Create Product

exports.createProduct = catchAsyncError(async (req, res, next) => {
      req.body.user = req.user.id;
      const product = await Product.create(req.body);

      res.status(201).json({
            success: true,
            product
      })

});

//Get All Products

exports.getAllprodcuts = async (req, res, next) => {
      resultPerpage = 5
      const apiFeatures = new ApiFeature(Product.find(), req.query).search().filter().pagination(resultPerpage);
      const product = await apiFeatures.query
      res.status(201).json({
            success: true,
            product
      })
}

//Update Product 

exports.updateProduct = async (req, res, next) => {
      let product = await Product.findById(req.params.id)

      if (!product) {
            return next(new ErrorHandler("Product Not Found", 404))
      }
      product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });

      res.status(200).json({
            success: true,
            product
      })

}

//Delete Product

exports.deleteProduct = async (req, res, next) => {
      let product = await Product.findById(req.params.id)

      if (!product) {
            return next(new ErrorHandler("Product Not Found", 404))
      }
      await product.remove()

      res.status(200).json({
            success: true,
      })
}
//Get Single Product
exports.getProductDetail = async (req, res, next) => {
      let product = await Product.findById(req.params.id)

      if (!product) {
            return next(new ErrorHandler("Product Not Found", 404))
      }
      res.status(200).json({
            success: true,
            product
      })
}

//Create a review or Update a review

exports.addReview = catchAsyncError(async (req, res, next) => {
      const { rating, comment, productId } = req.body;

      const review = {
            user: req.user._id.toString(),
            name: req.user.name,
            rating: Number(rating),
            comment,
      };
      console.log(review)
      const product = await Product.findById(productId);

      const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
      );
      if (isReviewed) {
            product.reviews.forEach((rev) => {
                  if (rev.user.toString() === req.user._id.toString())
                        (rev.rating = rating), (rev.comment = comment);
            });
      }
      else {
            product.reviews.push(review);
            product.numofReviews = product.reviews.length;
      }
      let avg = 0;

      product.reviews.forEach((rev) => {
            avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      res.status(200).json({
            success: true,
      });
})
// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
      const product = await Product.findById(req.query.id);
    
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
    
      res.status(200).json({
        success: true,
        reviews: product.reviews,
      });
    });
    
// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
      const product = await Product.findById(req.query.productId);
    
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
    
      const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
      );
    
      let avg = 0;
    
      reviews.forEach((rev) => {
        avg += rev.rating;
      });
    
      let ratings = 0;
    
      if (reviews.length === 0) {
        ratings = 0;
      } else {
        ratings = avg / reviews.length;
      }
    
      const numOfReviews = reviews.length;
    
      await Product.findByIdAndUpdate(
        req.query.productId,
        {
          reviews,
          ratings,
          numOfReviews,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    
      res.status(200).json({
        success: true,
      });
    });    