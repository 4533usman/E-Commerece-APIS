const express = require("express");
const {
    registerUser,
    loginUser,
    logOut,
    forgotPassword,
    resetPassword,
    getUserDetail,
    updatePassword,
    updateUser,
    getAllUser,
    getUser,
    updateUserRole,
    deleteUser
}
    =
    require("../controllers/userController");
const router = express.Router();

const { isAuthenticated, authorizedRole } = require("../middleware/auth");
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logOut)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated, getUserDetail);
router.route("/update/password").put(isAuthenticated, updatePassword);
router.route("/update/user").put(isAuthenticated, updateUser)
router.route("/admin/users").get(isAuthenticated, authorizedRole("admin"), getAllUser)
router.route("/admin/user/:id")
    .get(isAuthenticated, authorizedRole("admin"), getUser)
    .put(isAuthenticated, authorizedRole("admin"), updateUserRole)
    .delete(isAuthenticated, authorizedRole("admin"), deleteUser)

module.exports = router;