const express = require("express");
const {
  getAllcandidate,
  registerCandidate,
  deletecandidate,
  getCandidateDetails,
  uploadcsv
} = require("../controllers/candidateController.js");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");
const router = express.Router();

router.route("/addcandidate").post( registerCandidate);

router.route("/getcandidate").get( getAllcandidate);

router.route("/deletecandidate").post(deletecandidate)

router.route("/candidatesdetails/:id").get(getCandidateDetails)
router.route("/candidatesdetails/upload").post(uploadcsv)
module.exports = router;
// candidate/deletecandidate/:id