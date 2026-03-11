// models/MasterSubject.js

import mongoose from "mongoose";

const masterSubjectSchema = new mongoose.Schema({
  
  semester: {
    type: Number,
    required: true
  },

  subjectName: {
    type: String,
    required: true
  },

  subjectCode: {
    type: String,
    required: true
  }

}, { timestamps: true });

export default mongoose.model("MasterSubject", masterSubjectSchema);