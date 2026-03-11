import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true
  },

  subjectName: {
    type: String,
    required: true
  },

  subjectCode: {
    type: String,
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

  totalMarks: {
    type: Number,
    default: 0
  },

  attendance: {
    type: Number,
    default: 0
  },

  grade: {
    type: String
  },

  status: {
    type: String,
    enum: ["Pass", "Fail", "Risk"],
    default: "Risk"
  }

}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);