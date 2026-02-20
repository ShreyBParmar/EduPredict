import mongoose from "mongoose"

const studentSchema=new mongoose.Schema(
    {
        fullName:{
            type: String,
            required: true,
        },
        enrollmentId:{
            type: Number,
            unique:true,
            required: true,
            minlength: 12
        },
        semester:{
            type: Number,
            required: true
        }
    },
    {
        timestamps:true
    }
)

const Student= mongoose.model("Student", studentSchema);

export default Student;