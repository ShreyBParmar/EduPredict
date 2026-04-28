import mongoose, { model } from "mongoose";

const facultySubjectSchema= new mongoose.Schema(
    {
        faculty:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: true
        },
        subject:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "MasterSubject",
            required: true
        },
        semester:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const FacultySubject = mongoose.model("FacultySubject", facultySubjectSchema)

export default FacultySubject