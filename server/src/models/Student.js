import mongoose from "mongoose"

const studentSchema=new mongoose.Schema(
    {
        fullName:{
            type: String,
            required: true,
        },
        enrollmentId:{
            type: String,
            unique:true,
            required: true,
            maxlength: 14
        },
        semester:{
            type: Number,
            required: true
        },
        subjects:[{
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "MasterSubject",
                }]
    },
    {
        timestamps:true
    }
)

const Student= mongoose.model("Student", studentSchema);

export default Student;