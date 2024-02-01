const mongoose = require("mongoose");

const jobScheema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "what is the name of your company :)"],
      maxlength: 30,
    },
    position: {
      type: String,
      required: [true, "as kbibe said one day : send me ur location rani jay"],
      maxlength: 30,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user id"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobScheema);
