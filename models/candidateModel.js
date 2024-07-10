const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Schema } = require("mongoose");
const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    total_experience: {
      type: Number,
      required: true,
    },
    ctc: {
      type: Number,
    },
    ectc: {
      type: Number,
    },
    notice_period: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },

    resume: {
      type: String,
      required: false,
      default: null,
    },

    notes: {
      type: String,
      required: false,
      default: null,
    },
    sourced_by: {
      type: String,
    },
    comments_by_hr: {
      type: String,
    },

    interview_schedule: {
      type: String,
      default: "no",
    },
    selected: {
      type: String,
      default: "no",
    },

    joining_date: {
      type: Date,
      default: null,
    },
    shortlisted: {
      type: String,
      default: "no",
    },
    maxorgcount:{
      type: Number,
      default: 0,
    },
    maxinterviewcount:{
      type: Number,
      default: 0,
    },
    Organizationsdata: [{ type: Schema.Types.ObjectId, ref: "organizations" }],
    Interviewerdata: [{ type: Schema.Types.ObjectId, ref: "interview" }],
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model("candidate", candidateSchema);
module.exports = Candidate;
