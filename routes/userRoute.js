const express = require("express");
const {
    registerUser,
    loginUser,
    logout,getUserDetails
} = require("../controllers/userController.js");


const { isAuthenticatedUser ,authorizeRoles} = require('../middleware/auth.js');
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
module.exports = router;