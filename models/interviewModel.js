const mongoose = require("mongoose");
const {Schema} = require('mongoose');
const InterviewSchema = new mongoose.Schema(
  {
    interviewer_name: {
      type: String,
    },
    interviewer_comments: {
      type: String,
    },
    ratings:{
      type:String
    },
    interview_type: {
      type: String,
    },
    Proceed_for_next: {
      type: String,
    },
    Candidates: { type: Schema.Types.ObjectId, ref: 'candidate', },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("interview", InterviewSchema);
module.exports = Interview;
