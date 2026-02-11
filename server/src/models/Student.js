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
        year:{
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