const express = require("express");
const {
  createTender,
  updateTender,
  getTenderDetails,
  getTender,
  deletetender
} = require("../controllers/tenderController.js");


const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");
const router = express.Router();

router.route("/create").post(createTender);
router.route("/gettenders").get(getTender);
router.route("/delete/:id").delete(deletetender)
router.route("/update/:id").put(updateTender)
router.route("/gettender/:id").get(getTenderDetails)
module.exports = router;
