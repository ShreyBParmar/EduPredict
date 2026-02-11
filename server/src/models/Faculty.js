import mongoose from "mongoose"

const facultySchema=new mongoose.Schema(
    {
        fullName:{
            type: String,
            required: true,
        },
        facultyId:{
            type: Number,
            required: true,
            unique:true,
            minlength: 4
        },
        role:{
            type: String,
            required: true
        }
    },
    {
        timestamps:true
    }
)

const Faculty= mongoose.model("Faculty", facultySchema);

export default Faculty