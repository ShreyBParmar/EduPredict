// models/StudentSubject.js

import mongoose from "mongoose";

const studentSubjectSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterSubject",
    required: true
  },

  semester: {
    type: Number,
    required: true
  },

  internalMarks: {
    type: Number,
    default: 0
  },

  externalMarks: {
    type: Number,
    default: 0
  },

  attendance: {
    type: Number,
    default: 0
  },

  grade: {
    type: String,
    default: "-"
  },

  status: {
    type: String,
    enum: ["Safe", "Warning", "Risk"],
    default: "Safe"
  }

}, { timestamps: true });

export default mongoose.model("StudentSubject", studentSubjectSchema);