import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  semesterNumber: {
    type: Number,
    required: true
  },

  academicYear: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Semester", semesterSchema);