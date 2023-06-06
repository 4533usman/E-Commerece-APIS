const express = require("express")
const {
    getAllprodcuts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetail,
    addReview,
    getProductReviews,
    deleteReview
} = require("../controllers/productController")
const { isAuthenticated, authorizedRole } = require("../Middleware/auth")



const router = express.Router()

router.route("/products").get(getAllprodcuts)

router.route("/admin/products/new").post(isAuthenticated, authorizedRole("admin"), createProduct)

router.route("/admin/products/:id").put(isAuthenticated, authorizedRole("admin"), updateProduct).delete(deleteProduct)
router.route("/products/:id").get(getProductDetail)
router.route("/review").put(isAuthenticated, addReview);

router
    .route("/reviews")
    .get(getProductReviews)
    .delete(isAuthenticated, deleteReview);
module.exports = router