const mongoose = require("mongoose");

const SubjectDetails = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subjects",
  },
  context: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("subjectDetail", SubjectDetails);
