import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterSubject",
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty"
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true
        },
        isPresent: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  { timestamps: true }
);

// Prevent duplicate attendance records for the same subject, semester, and date
attendanceSchema.index({ subject: 1, semester: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
