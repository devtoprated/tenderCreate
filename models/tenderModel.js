const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const tenderSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
    },
    client_name: {
      type: String,
      required: true,
    },
    job_work: {
      type: String,
      required: true,
    },
    emd: {
      type: Number,
    },
    bid_amount: {
      type: Number,
    },
    submissionDate: {
      type: Date,
    },
    submittedOn: {
      type: String,
    },
    openingDate: {
      type: String,
    },

    status: {
      type: String,
    },
    l1_amount: {
      type: Number,
    },
    l1_companyName: {
      type: String,
    },
    anviam_position: {
      type: String,
    },
    emd_position: {
      type: String,
    },
    notes: {
      type: String,
    },
    attachments: {
      type: String,
      required: false,
      default: null,
    },
  
  },
  {
    timestamps: true,
  }
);

const Tender = mongoose.model("tender", tenderSchema);
module.exports = Tender;
