const express = require("express")
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController")

const router = express.Router();
const { isAuthenticated, authorizedRole } = require("../Middleware/auth")


router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/order/me").post(isAuthenticated, myOrders);
router.route("/admin/orders").get(isAuthenticated,authorizedRole("admin"),getAllOrders);
router.route("/admin/order/:id").
put(isAuthenticated,authorizedRole("admin"),updateOrderStatus)
.delete(isAuthenticated,authorizedRole("admin"),deleteOrder);

module.exports = router;