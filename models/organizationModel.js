const mongoose = require("mongoose");
const {Schema} = require('mongoose');
const OrganizationSchema = new mongoose.Schema(
  {
    job_title: {
      type: String,
    },
    org_name: {
      type: String,
    },
    org_city:{
      type:String
    },
    job_joining_date: {
      type: String,
    },
    releiving_date: {
      type: String,
    },
    experience: {
      type: String,
    },
    Candidates: { type: Schema.Types.ObjectId, ref: 'candidate', },
  },
  {
    timestamps: true,
  }
);

const Organizations = mongoose.model("organizations", OrganizationSchema);
module.exports = Organizations;
